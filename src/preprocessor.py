"""
Graph Pre-Processing, Blocked-Road Pruning, Charger Validation & Disconnected Component Analysis.
Addresses CEP Requirements Part A.1, Part A.2, and Part B.4.
"""
from collections import deque
from typing import Dict, List, Set, Tuple

from src.models import EVProfile, Node, RoadEdge


class NetworkPreprocessor:
    """Filters blocked roads, validates charger compatibility, and detects isolated nodes."""

    @staticmethod
    def build_active_adjacency_list(
        nodes: Dict[str, Node], edges: List[RoadEdge]
    ) -> Tuple[Dict[str, List[Tuple[str, RoadEdge]]], List[RoadEdge]]:
        """
        Requirement Part A.1:
        Excludes every road flagged `is_blocked == True` from the candidate edge set
        before running the pathfinding algorithm.
        """
        adj: Dict[str, List[Tuple[str, RoadEdge]]] = {nid: [] for nid in nodes}
        excluded_edges: List[RoadEdge] = []

        for edge in edges:
            if edge.is_blocked:
                excluded_edges.append(edge)
                continue
            if edge.u in adj and edge.v in adj:
                adj[edge.u].append((edge.v, edge))
                # Bidirectional highway traversal
                reverse_edge = RoadEdge(
                    u=edge.v,
                    v=edge.u,
                    distance_km=edge.distance_km,
                    speed_kmh=edge.speed_kmh,
                    is_blocked=edge.is_blocked,
                    road_name=edge.road_name,
                )
                adj[edge.v].append((edge.u, reverse_edge))

        return adj, excluded_edges

    @staticmethod
    def analyze_connectivity(
        nodes: Dict[str, Node],
        adj: Dict[str, List[Tuple[str, RoadEdge]]],
        origin_id: str,
    ) -> Tuple[Set[str], List[str], List[List[str]]]:
        """
        Requirement Part A.2:
        Detects whether the road graph is disconnected, reports isolated cities by name,
        and identifies connected components (spanning forest structure) instead of failing.
        """
        visited_from_origin: Set[str] = set()
        if origin_id in adj:
            queue = deque([origin_id])
            visited_from_origin.add(origin_id)
            while queue:
                curr = queue.popleft()
                for nbr, _ in adj.get(curr, []):
                    if nbr not in visited_from_origin:
                        visited_from_origin.add(nbr)
                        queue.append(nbr)

        isolated_names: List[str] = [
            f"{nodes[nid].name} ({nid})"
            for nid in sorted(nodes.keys())
            if nid not in visited_from_origin
        ]

        # Compute all connected components across the graph
        all_visited: Set[str] = set()
        components: List[List[str]] = []
        for nid in sorted(nodes.keys()):
            if nid not in all_visited:
                comp: List[str] = []
                q = deque([nid])
                all_visited.add(nid)
                while q:
                    c = q.popleft()
                    comp.append(c)
                    for nbr, _ in adj.get(c, []):
                        if nbr not in all_visited:
                            all_visited.add(nbr)
                            q.append(nbr)
                components.append(comp)

        return visited_from_origin, isolated_names, components

    @staticmethod
    def sanitize_chargers_for_ev(
        nodes: Dict[str, Node], ev: EVProfile
    ) -> List[str]:
        """
        Requirement Part B.4:
        1. Offline/unavailable stations (`is_available == False`) are flagged and excluded
           from charging consideration without breaking the recurrence.
        2. Stations whose power rating exceeds the EV's internal max charge acceptance
           are clamped to `ev.max_charge_acceptance_kw`.
        """
        notes: List[str] = []
        for nid, node in nodes.items():
            st = node.station
            if st is None:
                continue
            if not st.is_available:
                notes.append(
                    f"Station '{st.name}' at {node.name} is OFFLINE -> Excluded from DP charging stops."
                )
            elif st.power_kw > ev.max_charge_acceptance_kw:
                notes.append(
                    f"Station '{st.name}' ({st.power_kw:.0f} kW) clamped to EV max acceptance ({ev.max_charge_acceptance_kw:.0f} kW)."
                )
        return notes
