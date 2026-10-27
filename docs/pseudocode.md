# Formal Pseudocode by Module (CEP Deliverable)

## Algorithm 1: Part A — A* Route Discovery with Charger-Density Tie-Breaking
```text
ALGORITHM AStarRouteDiscovery(G(V, E), Origin S, Destination D)
INPUT: Road graph G(V, E), start vertex S, target vertex D
OUTPUT: Optimal path P, edge sequence E_P

1.  Filter out all edges e in E where e.is_blocked == TRUE
2.  Initialize g[v] <- INFINITY for all v in V; g[S] <- 0
3.  Initialize ClosedSet <- EMPTY, ParentNode <- EMPTY
4.  h_S <- HaversineKM(S.lat, S.lon, D.lat, D.lon)
5.  Push (round(h_S, 3), -PowerKW(S), h_S, 0, S) into MinHeap OpenSet
6.  WHILE OpenSet is not empty DO
7.      Pop (_, _, _, curr_g, u) from OpenSet
8.      IF u in ClosedSet THEN CONTINUE
9.      Add u to ClosedSet
10.     IF u == D THEN RETURN ReconstructPath(ParentNode, S, D)
11.     FOR EACH neighbor (v, edge) in Adj[u] DO
12.         IF v in ClosedSet THEN CONTINUE
13.         tentative_g <- curr_g + edge.distance_km
14.         IF tentative_g < g[v] OR (tentative_g == g[v] AND PowerKW(u) > PowerKW(ParentNode[v])) THEN
15.             g[v] <- tentative_g
16.             ParentNode[v] <- u
17.             h_v <- HaversineKM(v.lat, v.lon, D.lat, D.lon)
18.             f_v <- tentative_g + h_v
19.             Push (round(f_v, 3), -PowerKW(v), h_v, tentative_g, v) into OpenSet
20. RETURN DISCONNECTED_GRAPH_ERROR
```

## Algorithm 2: Part B — Multi-Stage DP Charging Schedule Optimizer
```text
ALGORITHM DPChargingSchedule(Corridor S[0..k], Energies E[0..k-1], EV, T_max)
INPUT: Corridor stations S[0..k], segment energies E, EV profile (B_min, B_max, B_0), max time T_max
OUTPUT: Optimal charging stop schedule and total cost

1.  Initialize DP_Cost[0..k][B_min..B_max] <- INFINITY
2.  Initialize DP_Time[0..k][B_min..B_max] <- INFINITY
3.  Initialize Parent[0..k][B_min..B_max] <- NULL
4.  DP_Cost[0][B_0] <- 0; DP_Time[0][B_0] <- 0
5.  FOR i <- 0 TO k - 1 DO
6.      can_charge <- (S[i].station != NULL AND S[i].station.is_available)
7.      P_eff <- MIN(S[i].station.power_kw, EV.max_acceptance_kw) IF can_charge ELSE 0
8.      FOR b_arr <- B_min TO B_max DO
9.          IF DP_Cost[i][b_arr] == INFINITY THEN CONTINUE
10.         max_delta <- (B_max - b_arr) IF can_charge ELSE 0
11.         FOR delta_b <- 0 TO max_delta DO
12.             b_next <- b_arr + delta_b - E[i]
13.             IF b_next < B_min THEN CONTINUE
14.             t_charge <- (S[i].queue_wait + delta_b / P_eff) IF delta_b > 0 ELSE 0
15.             t_new <- DP_Time[i][b_arr] + t_charge + DriveTime[i]
16.             c_new <- DP_Cost[i][b_arr] + delta_b * S[i].tariff
17.             IF t_new <= T_max AND c_new < DP_Cost[i+1][b_next] THEN
18.                 DP_Cost[i+1][b_next] <- c_new
19.                 DP_Time[i+1][b_next] <- t_new
20.                 Parent[i+1][b_next] <- (b_arr, delta_b)
21. b_star <- ARGMIN_{b in [B_min..B_max]} DP_Cost[k][b]
22. RETURN BacktrackSchedule(Parent, k, b_star)
```
