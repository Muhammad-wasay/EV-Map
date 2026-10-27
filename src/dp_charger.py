"""
Part B — Multi-Stage Charging Stop & Energy Allocation Optimizer (Dynamic Programming Paradigm).

Formulation:
- Let stations/nodes along the A* corridor be indexed i = 0, 1, ..., k.
- Let discretized battery state be b in {B_min, B_min + 1, ..., B_max} (in kWh).
- DP[i][b] maintains the Pareto-Optimal Frontier of non-dominated (cost, elapsed_time)
  states arriving at corridor node i with residual battery level b (kWh), subject to
  cumulative trip time <= T_max.
- Each state stores its backtracking pointer (prev_b, prev_state_idx, delta_b_charged)
  to reconstruct the exact station stops and kWh charged at each stop (Requirement B.5).
"""
from typing import Dict, List, Optional, Tuple

from src.models import ChargingStopDecision, CorridorSegment, EVProfile, Node


class DPChargingOptimizer:
    """Solves the multi-stage EV charging schedule problem via Dynamic Programming."""

    @staticmethod
    def optimize_charging_schedule(
        corridor_nodes: List[Node],
        segments: List[CorridorSegment],
        ev: EVProfile,
        max_trip_time_hours: float,
    ) -> Dict[str, object]:
        """
        Executes bottom-up Dynamic Programming across the k corridor segments.
        Handles all CEP Part B requirements:
          - Multiple distinct stations with varying kW speeds and PKR/kWh tariffs.
          - Offline stations (`is_available == False`) automatically skipped (delta_b = 0 only).
          - Charger power exceeding EV max acceptance clamped to `ev.max_charge_acceptance_kw`.
          - Edge Case (Part B.3): If `max_trip_time_hours` is too tight for any feasible schedule,
            automatically computes the minimum-time fallback schedule and reports the exact time deficit.
        """
        # Run Primary Pass: Minimize Total Cost subject to Total Time <= max_trip_time_hours
        primary_result = DPChargingOptimizer._run_dp_table(
            corridor_nodes=corridor_nodes,
            segments=segments,
            ev=ev,
            time_limit_hours=max_trip_time_hours,
            optimize_for="COST",
        )

        if primary_result["feasible"]:
            primary_result["status"] = "OPTIMAL"
            primary_result["time_budget_violated"] = False
            return primary_result

        # Edge Case (Requirement Part B.3): Over-constrained time budget (T_trip > T_max)
        # Run Fallback Pass without hard time cutoff, minimizing total trip time first, then cost.
        fallback_result = DPChargingOptimizer._run_dp_table(
            corridor_nodes=corridor_nodes,
            segments=segments,
            ev=ev,
            time_limit_hours=float("inf"),
            optimize_for="TIME_THEN_COST",
        )

        if fallback_result["feasible"]:
            fallback_result["status"] = "FEASIBLE_TIME_WARNING"
            fallback_result["time_budget_violated"] = True
            min_time = fallback_result["total_trip_time_hours"]
            deficit = min_time - max_trip_time_hours
            fallback_result["warning"] = (
                f"OVER-CONSTRAINED TIME BUDGET: Requested T_max = {max_trip_time_hours:.2f} hrs, "
                f"but minimum physically achievable trip time is {min_time:.2f} hrs "
                f"(exceeds budget by {deficit:.2f} hrs). Returning minimum-time feasible charging plan."
            )
            return fallback_result

        return {
            "feasible": False,
            "status": "INFEASIBLE_DEADZONE",
            "warning": "No feasible charging schedule exists even with unlimited time budget.",
        }

    @staticmethod
    def _prune_pareto_frontier(
        candidates: List[Tuple[float, float, int, int, int]]
    ) -> List[Tuple[float, float, int, int, int]]:
        """
        Given candidate states (cost, time, prev_b, prev_idx, delta_b) at (i, b),
        sorts by (cost ASC, time ASC) and keeps only Pareto-undominated states
        where time strictly decreases as cost increases.
        """
        if not candidates:
            return []
        candidates.sort(key=lambda x: (round(x[0], 4), round(x[1], 4)))
        frontier: List[Tuple[float, float, int, int, int]] = []
        min_time_seen = float("inf")
        for state in candidates:
            cost, elapsed_t = state[0], state[1]
            if elapsed_t < min_time_seen - 0.01:
                frontier.append(state)
                min_time_seen = elapsed_t
        return frontier

    @staticmethod
    def _run_dp_table(
        corridor_nodes: List[Node],
        segments: List[CorridorSegment],
        ev: EVProfile,
        time_limit_hours: float,
        optimize_for: str = "COST",
    ) -> Dict[str, object]:
        num_nodes = len(corridor_nodes)
        b_min = ev.min_reserve_kwh
        b_max = ev.battery_capacity_kwh
        b_init = max(b_min, min(b_max, ev.initial_soc_kwh))

        # dp_table[i][b] = list of Pareto-optimal tuples:
        # (cost_pkr, elapsed_time_hrs, prev_b, prev_pareto_idx, delta_b_charged)
        dp_table: List[List[List[Tuple[float, float, int, int, int]]]] = [
            [[] for _ in range(b_max + 1)] for _ in range(num_nodes)
        ]

        # Base case at Origin (node 0)
        dp_table[0][b_init] = [(0.0, 0.0, -1, -1, 0)]

        states_evaluated = 0

        for i in range(num_nodes - 1):
            curr_node = corridor_nodes[i]
            seg = segments[i]
            energy_need = seg.energy_required_kwh
            drive_time = seg.drive_time_hours
            st = curr_node.station

            can_charge = st is not None and st.is_available and st.power_kw > 0
            effective_kw = (
                min(st.power_kw, ev.max_charge_acceptance_kw) if can_charge else 0.0
            )
            tariff = st.cost_per_kwh if can_charge else 0.0
            queue_wait = st.queue_wait_hours if can_charge else 0.0

            next_candidates: List[List[Tuple[float, float, int, int, int]]] = [
                [] for _ in range(b_max + 1)
            ]

            for b_arr in range(b_min, b_max + 1):
                frontier_at_b = dp_table[i][b_arr]
                if not frontier_at_b:
                    continue

                max_delta = (b_max - b_arr) if can_charge else 0

                for delta_b in range(0, max_delta + 1):
                    b_dep = b_arr + delta_b
                    b_next = b_dep - energy_need

                    # Enforce safety arrival reserve constraint B_min at node i+1
                    if b_next < b_min:
                        continue

                    if delta_b == 0:
                        charge_time = 0.0
                        charge_cost = 0.0
                    else:
                        charge_time = queue_wait + (delta_b / effective_kw)
                        charge_cost = delta_b * tariff

                    for p_idx, (curr_c, curr_t, _, _, _) in enumerate(frontier_at_b):
                        states_evaluated += 1
                        new_time = curr_t + charge_time + drive_time
                        if new_time > time_limit_hours + 1e-9:
                            continue
                        new_cost = curr_c + charge_cost
                        next_candidates[b_next].append(
                            (new_cost, new_time, b_arr, p_idx, delta_b)
                        )

            for b_next in range(b_min, b_max + 1):
                if next_candidates[b_next]:
                    dp_table[i + 1][b_next] = DPChargingOptimizer._prune_pareto_frontier(
                        next_candidates[b_next]
                    )

        # Find optimal terminal state at Destination (node num_nodes - 1) with b >= b_min
        best_final_b = -1
        best_final_p_idx = -1
        best_cost = float("inf")
        best_time = float("inf")

        for b_final in range(b_min, b_max + 1):
            for p_idx, (c, t, _, _, _) in enumerate(dp_table[num_nodes - 1][b_final]):
                if optimize_for == "COST":
                    if c < best_cost - 1e-6 or (
                        abs(c - best_cost) <= 1e-6 and t < best_time
                    ):
                        best_cost = c
                        best_time = t
                        best_final_b = b_final
                        best_final_p_idx = p_idx
                else:
                    if t < best_time - 1e-6 or (
                        abs(t - best_time) <= 1e-6 and c < best_cost
                    ):
                        best_time = t
                        best_cost = c
                        best_final_b = b_final
                        best_final_p_idx = p_idx

        if best_final_b == -1:
            return {"feasible": False, "states_evaluated": states_evaluated}

        # Requirement Part B.5: Backtrack through DP table to reconstruct exact stops
        charging_stops: List[ChargingStopDecision] = []
        curr_b = best_final_b
        curr_p_idx = best_final_p_idx
        total_charged_kwh = 0
        total_charging_time = 0.0

        for i in range(num_nodes - 1, 0, -1):
            _, _, prev_b, prev_p_idx, delta_b = dp_table[i][curr_b][curr_p_idx]
            if delta_b > 0:
                node_i = corridor_nodes[i - 1]
                st = node_i.station
                eff_kw = min(st.power_kw, ev.max_charge_acceptance_kw)
                c_time = st.queue_wait_hours + (delta_b / eff_kw)
                c_cost = delta_b * st.cost_per_kwh
                charging_stops.append(
                    ChargingStopDecision(
                        node_id=node_i.node_id,
                        city_name=node_i.name,
                        station_name=st.name,
                        arrival_soc_kwh=prev_b,
                        departure_soc_kwh=prev_b + delta_b,
                        charged_kwh=delta_b,
                        charge_time_hours=round(c_time, 3),
                        charge_cost_pkr=round(c_cost, 2),
                        effective_power_kw=eff_kw,
                        tariff_pkr_per_kwh=st.cost_per_kwh,
                    )
                )
                total_charged_kwh += delta_b
                total_charging_time += c_time
            curr_b = prev_b
            curr_p_idx = prev_p_idx

        charging_stops.reverse()
        driving_time = sum(s.drive_time_hours for s in segments)

        return {
            "feasible": True,
            "charging_stops": charging_stops,
            "total_charging_cost_pkr": round(best_cost, 2),
            "driving_time_hours": round(driving_time, 3),
            "charging_time_hours": round(total_charging_time, 3),
            "total_trip_time_hours": round(best_time, 3),
            "total_energy_charged_kwh": total_charged_kwh,
            "final_arrival_soc_kwh": best_final_b,
            "dp_metrics": {
                "corridor_stations_k": num_nodes,
                "battery_states_B": b_max - b_min + 1,
                "dp_states_evaluated": states_evaluated,
                "brute_force_combinations": f"{(b_max - b_min + 1)}^{num_nodes - 1}",
            },
        }
