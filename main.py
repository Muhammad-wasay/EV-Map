"""
VoltPath — Main CLI Entry Point (NED University CT-363 DAA CEP)
Executes:
  1. Hybrid API Client Check (with automatic Mock Dataset Fallback)
  2. Part A (A* Search + Charger Tie-Breaking + Incremental Dynamic Re-Routing)
  3. Part B (Multi-Stage DP Charging Stop & kWh Schedule Optimization + Backtracking)
  4. All 3 Mandatory CEP Edge-Case Tests (Disconnected Graph, Range Dead-Zone, Tight Time Budget)
  5. Part C (Integrated Pipeline + Sensitivity Analysis)
  6. Interactive HTML Map Generation (`ui/voltpath_map.html`)
"""
import argparse
from src.astar_router import AStarRouter
from src.pipeline import VoltPathPipeline
from src.preprocessor import NetworkPreprocessor
from ui.dashboard import generate_interactive_map_html


def print_banner(title: str) -> None:
    print("\n" + "=" * 82)
    print(f"  {title}")
    print("=" * 82)


def run_complete_cep_demonstration(use_live_api: bool = False) -> None:
    pipeline = VoltPathPipeline(use_live_api=use_live_api)

    print_banner("VOLTPATH: EV TRIP CHARGING PLANNER (NED CT-363 DAA CEP)")
    print("Team: M. Wasay Rafiq (CT-24236) | M. Sarim Umer (CT-24235)")
    print("      M. Usman Masood (CT-24239) | M. Feras Malik (CT-24247)")

    # -------------------------------------------------------------------------
    # 1. WORKED EXAMPLE (Part A + Part B + Part C on 14-City Highway Network)
    # -------------------------------------------------------------------------
    print_banner("1. PRIMARY WORKED EXAMPLE: KARACHI (N01) -> ISLAMABAD (N14)")
    plan = pipeline.run_trip_planner(
        origin_id="N01", dest_id="N14", max_allowed_time_hours=18.5
    )

    for log_line in pipeline.api_client.api_status_log:
        print(f"  {log_line}")

    print(f"\n  [Status]             : {plan.status}")
    print(f"  [Data Source]        : {plan.data_source}")
    print(f"  [Optimal A* Route]   : {' -> '.join(plan.route_node_names)}")
    print(f"  [Total Distance]     : {plan.total_distance_km:.1f} km")
    print(f"  [Driving Time]       : {plan.driving_time_hours:.2f} hrs")
    print(f"  [Charging Time]      : {plan.charging_time_hours:.2f} hrs")
    print(f"  [Total Trip Duration]: {plan.total_trip_time_hours:.2f} hrs (Max Allowed: {plan.max_allowed_time_hours:.2f} hrs)")
    print(f"  [Total Charging Cost]: PKR {plan.total_charging_cost_pkr:,.2f}")
    print(f"  [Total Energy Added] : {plan.total_energy_charged_kwh} kWh")
    print(f"  [Final Arrival SoC]  : {plan.final_arrival_soc_kwh} kWh (Safety Reserve >= 12 kWh)")
    print(f"  [A* Telemetry]       : {plan.astar_metrics}")
    print(f"  [DP Telemetry]       : {plan.dp_metrics}")

    print("\n  --- Reconstructed DP Charging Schedule (Backtracked via Parent[i][b]) ---")
    print(f"  {'Stop City':<28} | {'Station Name':<28} | {'SoC (Arr->Dep)':<15} | {'Added':<8} | {'Time':<8} | {'Cost (PKR)'}")
    print("  " + "-" * 105)
    for stop in plan.charging_stops:
        soc_str = f"{stop.arrival_soc_kwh}->{stop.departure_soc_kwh} kWh"
        print(
            f"  {stop.city_name:<28} | {stop.station_name:<28} | {soc_str:<15} | "
            f"+{stop.charged_kwh:<3} kWh | {stop.charge_time_hours*60:>4.0f} min | PKR {stop.charge_cost_pkr:>8,.2f}"
        )

    # -------------------------------------------------------------------------
    # 2. PART A.6 EXTENSION: INCREMENTAL ROUTE UPDATE ON MID-TRIP ROAD CLOSURE
    # -------------------------------------------------------------------------
    print_banner("2. PART A.6 EXTENSION: INCREMENTAL DYNAMIC ROUTE UPDATE")
    nodes, edges, _, _ = pipeline.api_client.load_network_and_ev()
    adj, _ = NetworkPreprocessor.build_active_adjacency_list(nodes, edges)
    init_nodes, init_edges, _ = AStarRouter.find_optimal_route(nodes, adj, "N01", "N14")

    # Simulate 3 roads becoming blocked mid-journey
    newly_blocked = [("N07", "N09"), ("N09", "N11"), ("N03", "N06")]
    inc_res = AStarRouter.incremental_route_update(
        nodes, edges, init_nodes, init_edges, newly_blocked
    )
    print(f"  Newly Blocked Roads       : {newly_blocked}")
    print(f"  Local Divergence Node     : {inc_res['divergence_node']}")
    print(f"  Updated Route (Repaired)  : {' -> '.join(nodes[n].name for n in inc_res['updated_path_nodes'])}")
    print(f"  Updated Distance          : {inc_res['updated_distance_km']} km")
    print(f"  Incremental Nodes Expanded: {inc_res['incremental_nodes_expanded']} vs Full Scratch: {inc_res['full_scratch_nodes_expanded']} ({inc_res['nodes_saved_pct']}% saved)")

    # -------------------------------------------------------------------------
    # 3. MANDATORY CEP EDGE-CASE TESTS (WP5 Requirement)
    # -------------------------------------------------------------------------
    print_banner("3. MANDATORY CEP EDGE-CASE DEMONSTRATIONS (WP5)")

    # Edge Case 1: Disconnected Graph
    ec1 = pipeline.run_trip_planner(
        origin_id="N01", dest_id="N04", dataset_path="data/edge_case_disconnected.json"
    )
    print(f"\n  [Edge Case 1 - Disconnected Graph] Status: {ec1.status}")
    print(f"    -> Isolated Nodes Detected: {ec1.isolated_nodes}")
    print(f"    -> Diagnostic: {ec1.warnings[0]}")

    # Edge Case 2: Range Dead-Zone (Offline Stations / Gap > Max Range)
    ec2 = pipeline.run_trip_planner(
        origin_id="N01", dest_id="N04", dataset_path="data/edge_case_deadzone.json"
    )
    print(f"\n  [Edge Case 2 - Range Dead-Zone] Status: {ec2.status}")
    for w in ec2.warnings:
        print(f"    -> {w}")

    # Edge Case 3: Over-Constrained Trip Time (T_trip > T_max)
    ec3 = pipeline.run_trip_planner(
        origin_id="N01", dest_id="N14", max_allowed_time_hours=11.0
    )
    print(f"\n  [Edge Case 3 - Tight Time Budget (T_max = 11.0h)] Status: {ec3.status}")
    print(f"    -> Fallback Min-Time Achieved: {ec3.total_trip_time_hours:.2f} hrs | Cost: PKR {ec3.total_charging_cost_pkr:,.2f}")
    print(f"    -> Diagnostic: {ec3.warnings[-1]}")

    # -------------------------------------------------------------------------
    # 4. PART C: SENSITIVITY ANALYSIS
    # -------------------------------------------------------------------------
    print_banner("4. PART C: SENSITIVITY ANALYSIS (REMOVING TOP 2 MEGA-CHARGER HUBS)")
    sens = pipeline.run_sensitivity_analysis()
    print(f"  Disabled Hubs         : {', '.join(sens['removed_hubs'])}")
    print(f"  Baseline Distance/Cost: {sens['baseline_distance_km']} km | PKR {sens['baseline_cost_pkr']:,.2f} | {sens['baseline_time_hours']} hrs")
    print(f"  Perturbed Distance/Cost: {sens['perturbed_distance_km']} km | PKR {sens['perturbed_cost_pkr']:,.2f} | {sens['perturbed_time_hours']} hrs")
    print(f"  Baseline Stops        : {sens['baseline_stops']}")
    print(f"  Perturbed Stops       : {sens['perturbed_stops']}")

    # -------------------------------------------------------------------------
    # 5. GENERATE FREE OPENSTREETMAP HTML DASHBOARD
    # -------------------------------------------------------------------------
    html_file = generate_interactive_map_html(nodes, edges, plan)
    print_banner(f"5. INTERACTIVE MAP GENERATED: {html_file}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="VoltPath EV Trip Charging Planner")
    parser.add_argument("--use-api", action="store_true", help="Attempt live API calls before mock fallback")
    args = parser.parse_args()
    run_complete_cep_demonstration(use_live_api=args.use_api)
