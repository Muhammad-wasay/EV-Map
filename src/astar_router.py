"""
Part A — Spatial Route Discovery Engine using the A* (A-Star) Heuristic Paradigm.

Features:
1. Admissible & Consistent Haversine Great-Circle Heuristic h(n).
2. Explicit Tie-Breaking Rule (Part A.3): When two paths have equal f(n), prefers
   nodes with higher available charging station power kW, then smaller h(n).
3. Incremental Route Update (Part A.6 Extension): When roads become blocked after
   initial route computation, repairs only the affected downstream branch without
   recomputing the unaffected prefix from scratch.
"""
import heapq
import math
from typing import Dict, List, Optional, Set, Tuple

from src.models import Node, RoadEdge
from src.preprocessor import NetworkPreprocessor


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes exact Great-Circle geodesic distance (km) between two GPS points.
    Because straight-line geodesic distance never exceeds physical highway distance,
    h(u) = haversine_km(u, dest) is strictly ADMISSIBLE and CONSISTENT.
    """
    radius_earth_km = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(d_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2.0) ** 2
    )
    return 2.0 * radius_earth_km * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))


class AStarRouter:
    """Part A: A* Search Engine with Charger-Aware Tie-Breaking and Incremental Repair."""

    @staticmethod
    def find_optimal_route(
        nodes: Dict[str, Node],
        adj: Dict[str, List[Tuple[str, RoadEdge]]],
        origin_id: str,
        dest_id: str,
    ) -> Tuple[Optional[List[str]], Optional[List[RoadEdge]], Dict[str, float]]:
        """
        Executes A* Search from `origin_id` to `dest_id`.
        f(n) = g(n) + h(n), where:
          - g(n) is exact cumulative highway distance (km) from origin.
          - h(n) is admissible Haversine straight-line distance (km) to destination.
        Tie-Breaking Rule (Part A.3):
          When f(u) == f(v) (rounded to 1e-3 km), prefer the node with higher
          available charger power (-power_kw), then smaller heuristic h(n).
        """
        if origin_id not in nodes or dest_id not in nodes:
            return None, None, {"nodes_expanded": 0, "edges_examined": 0}

        dest_node = nodes[dest_id]

        def heuristic(nid: str) -> float:
            n = nodes[nid]
            return haversine_km(n.lat, n.lon, dest_node.lat, dest_node.lon)

        def charger_priority(nid: str) -> float:
            st = nodes[nid].station
            if st and st.is_available:
                return -float(st.power_kw)
            return 0.0

        # Priority queue items: (f_rounded, charger_tie_breaker, h_val, g_val, node_id)
        open_heap: List[Tuple[float, float, float, float, str]] = []
        h_start = heuristic(origin_id)
        heapq.heappush(
            open_heap,
            (round(h_start, 3), charger_priority(origin_id), h_start, 0.0, origin_id),
        )

        g_score: Dict[str, float] = {nid: float("inf") for nid in nodes}
        g_score[origin_id] = 0.0

        came_from_node: Dict[str, str] = {}
        came_from_edge: Dict[str, RoadEdge] = {}
        closed_set: Set[str] = set()

        nodes_expanded = 0
        edges_examined = 0
        tie_breaks_triggered = 0

        while open_heap:
            _, _, _, curr_g, curr_id = heapq.heappop(open_heap)

            if curr_id in closed_set:
                continue
            closed_set.add(curr_id)
            nodes_expanded += 1

            if curr_id == dest_id:
                path_nodes, path_edges = AStarRouter._reconstruct_path(
                    came_from_node, came_from_edge, origin_id, dest_id
                )
                total_dist = g_score[dest_id]
                total_drive_time = sum(e.travel_time_hours for e in path_edges)
                metrics = {
                    "nodes_expanded": nodes_expanded,
                    "edges_examined": edges_examined,
                    "tie_breaks_triggered": tie_breaks_triggered,
                    "total_distance_km": round(total_dist, 2),
                    "total_drive_time_hours": round(total_drive_time, 3),
                    "heuristic_origin_km": round(h_start, 2),
                }
                return path_nodes, path_edges, metrics

            for nbr_id, edge in adj.get(curr_id, []):
                edges_examined += 1
                if nbr_id in closed_set:
                    continue

                tentative_g = curr_g + edge.distance_km
                if tentative_g < g_score[nbr_id] - 1e-6:
                    g_score[nbr_id] = tentative_g
                    came_from_node[nbr_id] = curr_id
                    came_from_edge[nbr_id] = edge
                    h_nbr = heuristic(nbr_id)
                    f_nbr = tentative_g + h_nbr
                    heapq.heappush(
                        open_heap,
                        (
                            round(f_nbr, 3),
                            charger_priority(nbr_id),
                            h_nbr,
                            tentative_g,
                            nbr_id,
                        ),
                    )
                elif abs(tentative_g - g_score[nbr_id]) <= 1e-6:
                    # Identical cost path encountered: apply explicit tie-breaking rule
                    tie_breaks_triggered += 1
                    prev_parent = came_from_node.get(nbr_id)
                    if prev_parent and charger_priority(curr_id) < charger_priority(prev_parent):
                        came_from_node[nbr_id] = curr_id
                        came_from_edge[nbr_id] = edge

        return None, None, {
            "nodes_expanded": nodes_expanded,
            "edges_examined": edges_examined,
            "tie_breaks_triggered": tie_breaks_triggered,
        }

    @staticmethod
    def incremental_route_update(
        nodes: Dict[str, Node],
        all_edges: List[RoadEdge],
        initial_path_nodes: List[str],
        initial_path_edges: List[RoadEdge],
        newly_blocked_pairs: List[Tuple[str, str]],
    ) -> Dict[str, object]:
        """
        Requirement Part A.6 (Incremental Update Strategy):
        After the initial A* route is computed, up to 3 additional roads become blocked
        (e.g., flash flooding / highway closure).
        Instead of recomputing the entire route from the origin from scratch:
          1. Identifies the earliest edge on `initial_path_edges` affected by `newly_blocked_pairs`.
          2. Preserves the unaffected upstream prefix [Origin -> ... -> DivergenceNode].
          3. Runs a localized A* repair from `DivergenceNode` to `Destination` on the updated graph.
          4. Compares computational cost (nodes expanded) against a full scratch recomputation.
        """
        blocked_set = set()
        for u, v in newly_blocked_pairs:
            blocked_set.add((u, v))
            blocked_set.add((v, u))

        # Create updated edge list with the newly blocked roads marked
        updated_edges: List[RoadEdge] = []
        for e in all_edges:
            is_now_blocked = e.is_blocked or ((e.u, e.v) in blocked_set)
            updated_edges.append(
                RoadEdge(
                    u=e.u,
                    v=e.v,
                    distance_km=e.distance_km,
                    speed_kmh=e.speed_kmh,
                    is_blocked=is_now_blocked,
                    road_name=e.road_name,
                )
            )

        updated_adj, _ = NetworkPreprocessor.build_active_adjacency_list(nodes, updated_edges)

        # Find the first affected edge along the existing route
        first_blocked_idx: Optional[int] = None
        for idx, edge in enumerate(initial_path_edges):
            if (edge.u, edge.v) in blocked_set:
                first_blocked_idx = idx
                break

        origin_id = initial_path_nodes[0]
        dest_id = initial_path_nodes[-1]

        # If none of the newly blocked roads were on our active route, zero recomputation needed!
        if first_blocked_idx is None:
            return {
                "recomputed": False,
                "reason": "Newly blocked roads do not intersect active A* route.",
                "updated_path_nodes": initial_path_nodes,
                "incremental_nodes_expanded": 0,
                "full_scratch_nodes_expanded": 0,
            }

        # Retain valid prefix up to the divergence node (or backtrack one step if dead-end)
        prefix_idx = first_blocked_idx
        repaired_nodes: Optional[List[str]] = None
        repaired_edges: Optional[List[RoadEdge]] = None
        total_inc_expanded = 0

        while prefix_idx >= 0:
            diverge_node = initial_path_nodes[prefix_idx]
            sub_nodes, sub_edges, sub_m = AStarRouter.find_optimal_route(
                nodes, updated_adj, diverge_node, dest_id
            )
            total_inc_expanded += int(sub_m.get("nodes_expanded", 0))
            if sub_nodes is not None and sub_edges is not None:
                repaired_nodes = initial_path_nodes[:prefix_idx] + sub_nodes
                repaired_edges = initial_path_edges[:prefix_idx] + sub_edges
                break
            prefix_idx -= 1

        # Run full scratch recomputation for comparison (Part A.6 requirement)
        scratch_nodes, scratch_edges, scratch_metrics = AStarRouter.find_optimal_route(
            nodes, updated_adj, origin_id, dest_id
        )
        scratch_expanded = int(scratch_metrics.get("nodes_expanded", 0))

        return {
            "recomputed": True,
            "divergence_node": initial_path_nodes[max(prefix_idx, 0)],
            "updated_path_nodes": repaired_nodes,
            "updated_path_edges": repaired_edges,
            "updated_distance_km": round(
                sum(e.distance_km for e in repaired_edges), 2
            )
            if repaired_edges
            else None,
            "incremental_nodes_expanded": total_inc_expanded,
            "full_scratch_nodes_expanded": scratch_expanded,
            "scratch_distance_km": scratch_metrics.get("total_distance_km"),
            "nodes_saved_pct": round(
                100.0 * max(0, scratch_expanded - total_inc_expanded) / max(1, scratch_expanded),
                1,
            ),
        }

    @staticmethod
    def _reconstruct_path(
        came_from_node: Dict[str, str],
        came_from_edge: Dict[str, RoadEdge],
        origin_id: str,
        dest_id: str,
    ) -> Tuple[List[str], List[RoadEdge]]:
        nodes_seq = [dest_id]
        edges_seq: List[RoadEdge] = []
        curr = dest_id
        while curr != origin_id:
            edges_seq.append(came_from_edge[curr])
            curr = came_from_node[curr]
            nodes_seq.append(curr)
        nodes_seq.reverse()
        edges_seq.reverse()
        return nodes_seq, edges_seq
