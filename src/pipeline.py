"""
Part C — Integrated Pipeline & Sensitivity Analysis Engine.
Combines Part A (A* Route Discovery) and Part B (DP Charging Schedule Optimization)
into a unified decision-support pipeline.
"""
from typing import Dict, Optional

from src.api_client import VoltPathAPIClient
from src.astar_router import AStarRouter
from src.corridor_bridge import CorridorBridge
from src.dp_charger import DPChargingOptimizer
from src.models import EVProfile, TripPlan
from src.preprocessor import NetworkPreprocessor


class VoltPathPipeline:
    """End-to-End Integrated Decision-Support Pipeline (Part A + Part B + Part C)."""

    def __init__(self, use_live_api: bool = False):
        self.api_client = VoltPathAPIClient(use_live_api=use_live_api)

    def run_trip_planner(
        self,
        origin_id: str = "N01",
        dest_id: str = "N14",
        max_allowed_time_hours: float = 18.5,
        dataset_path: Optional[str] = None,
        ev_override: Optional[EVProfile] = None,
    ) -> TripPlan:
        nodes, edges, default_ev, data_source = self.api_client.load_network_and_ev(
            dataset_override=dataset_path
        )
        ev = ev_override or default_ev

        # Step 1: Pre-process graph (exclude blocked roads, analyze connectivity, validate chargers)
        adj, _ = NetworkPreprocessor.build_active_adjacency_list(nodes, edges)
        reachable_set, isolated_names, _ = NetworkPreprocessor.analyze_connectivity(
            nodes, adj, origin_id
        )
        charger_notes = NetworkPreprocessor.sanitize_chargers_for_ev(nodes, ev)

        origin_name = nodes[origin_id].name if origin_id in nodes else origin_id
        dest_name = nodes[dest_id].name if dest_id in nodes else dest_id

        # Check if destination is in a disconnected component (Edge Case 1)
        if dest_id not in reachable_set:
            return TripPlan(
                status="INFEASIBLE_DISCONNECTED",
                data_source=data_source,
                origin_name=origin_name,
                destination_name=dest_name,
                max_allowed_time_hours=max_allowed_time_hours,
                isolated_nodes=isolated_names,
                warnings=[
                    f"DISCONNECTED GRAPH: Destination '{dest_name}' cannot be reached from '{origin_name}'. "
                    f"Isolated nodes detected: {', '.join(isolated_names)}"
                ],
            )

        # Step 2: Part A — Run A* Search to find optimal highway route
        path_nodes, path_edges, astar_metrics = AStarRouter.find_optimal_route(
            nodes, adj, origin_id, dest_id
        )
        if not path_nodes or not path_edges:
            return TripPlan(
                status="INFEASIBLE_DISCONNECTED",
                data_source=data_source,
                origin_name=origin_name,
                destination_name=dest_name,
                isolated_nodes=isolated_names,
                warnings=["No valid route found by A* search."],
            )

        # Step 3: Corridor Bridge — Project 2D path to 1D charging corridor & check range dead-zones
        segments, deadzone_error = CorridorBridge.extract_corridor(
            nodes, path_nodes, path_edges, ev
        )
        corridor_nodes = [nodes[nid] for nid in path_nodes]

        if deadzone_error:
            return TripPlan(
                status="INFEASIBLE_DEADZONE",
                data_source=data_source,
                origin_name=origin_name,
                destination_name=dest_name,
                route_node_ids=path_nodes,
                route_node_names=[n.name for n in corridor_nodes],
                total_distance_km=astar_metrics["total_distance_km"],
                driving_time_hours=astar_metrics["total_drive_time_hours"],
                max_allowed_time_hours=max_allowed_time_hours,
                isolated_nodes=isolated_names,
                warnings=charger_notes + [deadzone_error],
                astar_metrics=astar_metrics,
            )

        # Step 4: Part B — Run Multi-Stage Dynamic Programming for Charging Schedule
        dp_res = DPChargingOptimizer.optimize_charging_schedule(
            corridor_nodes=corridor_nodes,
            segments=segments,
            ev=ev,
            max_trip_time_hours=max_allowed_time_hours,
        )

        warnings = list(charger_notes)
        if "warning" in dp_res:
            warnings.append(str(dp_res["warning"]))

        return TripPlan(
            status=str(dp_res.get("status", "INFEASIBLE")),
            data_source=data_source,
            origin_name=origin_name,
            destination_name=dest_name,
            route_node_ids=path_nodes,
            route_node_names=[n.name for n in corridor_nodes],
            total_distance_km=astar_metrics["total_distance_km"],
            driving_time_hours=float(dp_res.get("driving_time_hours", 0.0)),
            charging_time_hours=float(dp_res.get("charging_time_hours", 0.0)),
            total_trip_time_hours=float(dp_res.get("total_trip_time_hours", 0.0)),
            max_allowed_time_hours=max_allowed_time_hours,
            total_charging_cost_pkr=float(dp_res.get("total_charging_cost_pkr", 0.0)),
            total_energy_charged_kwh=int(dp_res.get("total_energy_charged_kwh", 0)),
            final_arrival_soc_kwh=int(dp_res.get("final_arrival_soc_kwh", 0)),
            charging_stops=dp_res.get("charging_stops", []),
            isolated_nodes=isolated_names,
            warnings=warnings,
            astar_metrics=astar_metrics,
            dp_metrics=dp_res.get("dp_metrics", {}),
        )

    def run_sensitivity_analysis(
        self,
        origin_id: str = "N01",
        dest_id: str = "N14",
        max_allowed_time_hours: float = 18.5,
    ) -> Dict[str, object]:
        """
        Requirement Part C (Sensitivity Test):
        Reruns the integrated pipeline after disabling two major active charging
        hubs on the network (Bahawalpur N08 & Faisalabad N11) and blocking the
        Sutlej Valley Highway (N08 -> N10), analyzing how both A* and DP outputs shift.
        """
        baseline_plan = self.run_trip_planner(
            origin_id=origin_id,
            dest_id=dest_id,
            max_allowed_time_hours=max_allowed_time_hours,
        )

        nodes, edges, ev, _ = self.api_client.load_network_and_ev()

        # Disable two key hubs used in the baseline schedule (Hyderabad N02 & Bahawalpur N08)
        removed_hubs = ["N02", "N08"]
        for hid in removed_hubs:
            if hid in nodes and nodes[hid].station:
                nodes[hid].station.is_available = False

        # Also block edge N08 -> N10 so A* must re-route through Multan (N09)
        for e in edges:
            if (e.u == "N08" and e.v == "N10") or (e.u == "N10" and e.v == "N08"):
                e.is_blocked = True

        adj, _ = NetworkPreprocessor.build_active_adjacency_list(nodes, edges)
        path_nodes, path_edges, astar_m = AStarRouter.find_optimal_route(
            nodes, adj, origin_id, dest_id
        )
        segments, _ = CorridorBridge.extract_corridor(nodes, path_nodes, path_edges, ev)
        corridor_nodes = [nodes[nid] for nid in path_nodes]
        dp_perturbed = DPChargingOptimizer.optimize_charging_schedule(
            corridor_nodes, segments, ev, max_allowed_time_hours
        )

        return {
            "removed_hubs": [f"{nodes[h].name} ({h})" for h in removed_hubs],
            "baseline_route": baseline_plan.route_node_names,
            "perturbed_route": [nodes[n].name for n in path_nodes],
            "baseline_distance_km": baseline_plan.total_distance_km,
            "perturbed_distance_km": astar_m["total_distance_km"],
            "baseline_cost_pkr": baseline_plan.total_charging_cost_pkr,
            "perturbed_cost_pkr": dp_perturbed.get("total_charging_cost_pkr"),
            "baseline_time_hours": baseline_plan.total_trip_time_hours,
            "perturbed_time_hours": dp_perturbed.get("total_trip_time_hours"),
            "baseline_stops": [
                f"{s.city_name} (+{s.charged_kwh} kWh @ PKR {s.tariff_pkr_per_kwh}/kWh)"
                for s in baseline_plan.charging_stops
            ],
            "perturbed_stops": [
                f"{s.city_name} (+{s.charged_kwh} kWh @ PKR {s.tariff_pkr_per_kwh}/kWh)"
                for s in dp_perturbed.get("charging_stops", [])
            ],
        }
