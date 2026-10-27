"""
Corridor Extraction Bridge:
Projects the 2D A* graph path into a 1D sequential charging corridor and verifies
inter-station range feasibility (detecting Range Dead-Zones).
"""
import math
from typing import Dict, List, Optional, Tuple

from src.models import CorridorSegment, EVProfile, Node, RoadEdge


class CorridorBridge:
    """Converts the A* node/edge sequence into discretized energy segments for DP."""

    @staticmethod
    def extract_corridor(
        nodes: Dict[str, Node],
        path_nodes: List[str],
        path_edges: List[RoadEdge],
        ev: EVProfile,
    ) -> Tuple[List[CorridorSegment], Optional[str]]:
        """
        Builds ordered corridor segments and checks whether any stretch between
        consecutive *available* charging stations exceeds the EV's maximum usable
        battery range (B_max - B_min).
        """
        segments: List[CorridorSegment] = []
        for edge in path_edges:
            energy_kwh = int(math.ceil(edge.distance_km * ev.consumption_kwh_per_km))
            segments.append(
                CorridorSegment(
                    from_node=nodes[edge.u],
                    to_node=nodes[edge.v],
                    distance_km=edge.distance_km,
                    drive_time_hours=edge.travel_time_hours,
                    energy_required_kwh=energy_kwh,
                    road_name=edge.road_name,
                )
            )

        # Check consecutive reachable charging stations along the corridor
        cumulative_energy_since_last_charger = 0
        cumulative_dist_since_last_charger = 0.0
        last_charger_city = nodes[path_nodes[0]].name

        # At Origin, the vehicle starts with initial_soc_kwh (or can charge if Origin has available station)
        origin_station = nodes[path_nodes[0]].station
        max_depart_from_last = (
            ev.battery_capacity_kwh
            if (origin_station and origin_station.is_available)
            else ev.initial_soc_kwh
        )

        for seg in segments:
            cumulative_energy_since_last_charger += seg.energy_required_kwh
            cumulative_dist_since_last_charger += seg.distance_km

            if cumulative_energy_since_last_charger > (max_depart_from_last - ev.min_reserve_kwh):
                deadzone_msg = (
                    f"RANGE DEAD-ZONE DETECTED between '{last_charger_city}' and '{seg.to_node.name}': "
                    f"Requires {cumulative_energy_since_last_charger} kWh ({cumulative_dist_since_last_charger:.0f} km), "
                    f"which exceeds maximum usable battery capacity "
                    f"{max_depart_from_last - ev.min_reserve_kwh} kWh "
                    f"(B_max={ev.battery_capacity_kwh} kWh, B_min={ev.min_reserve_kwh} kWh)."
                )
                return segments, deadzone_msg

            dest_st = seg.to_node.station
            if dest_st and dest_st.is_available:
                cumulative_energy_since_last_charger = 0
                cumulative_dist_since_last_charger = 0.0
                last_charger_city = seg.to_node.name
                max_depart_from_last = ev.battery_capacity_kwh

        return segments, None
