# VoltPath System Architecture (NED CT-363 DAA CEP)

## 1. High-Level Block Diagram

```mermaid
flowchart TD
    subgraph InputLayer["1. Input & Hybrid API/Mock Layer"]
        UI["User Trip Request<br/>(Origin S, Destination D, Max Time T_max)"]
        API["VoltPathAPIClient<br/>(OpenChargeMap + OSRM APIs)"]
        MOCK["Automatic Mock Fallback<br/>(data/highway_network.json)"]
    end

    subgraph PreProc["2. Pre-Processing & Constraint Filter"]
        FILT["Edge & Station Validator<br/>(Prune closed roads & offline stations)"]
        REACH["Component & Reachability Analyzer<br/>(Detect isolated nodes / range dead-zones)"]
    end

    subgraph Stage1["3. Part A: Spatial Route Engine (A* Paradigm)"]
        HEUR["Admissible Haversine Heuristic h(n)"]
        ASTAR["A* Search Engine<br/>f(n) = g(n) + h(n) with Min-Heap"]
        TIE["Tie-Breaking Resolver<br/>(Prefer nodes with higher charger power kW)"]
        INC["Incremental Re-Router (Part A.6)<br/>(Local path repair on mid-trip road closure)"]
    end

    subgraph Bridge["4. Corridor Extraction Bridge"]
        CORR["Route-to-Corridor Projector<br/>(Extracts ordered stations S_0..S_k & checks range gaps)"]
    end

    subgraph Stage2["5. Part B: Charging Schedule Optimizer (DP Paradigm)"]
        STATE["State-Space Table<br/>DP_Cost[i][b] & DP_Time[i][b]"]
        TRANS["Feasibility & Transition Engine<br/>(Enforces B_min <= b <= B_max & Time <= T_max)"]
        BACK["Backtracking Reconstructor<br/>(Parent[i][b] -> Exact Stop & kWh Plan)"]
    end

    subgraph OutputLayer["6. Part C: Integrated Output & Sensitivity Analyzer"]
        PLAN["Final Feasible Trip Manifest & HTML Map"]
        SENS["Sensitivity & Edge-Case Evaluator"]
    end

    UI --> API
    API -->|Fallback if no key/offline| MOCK
    API --> FILT
    MOCK --> FILT
    FILT --> REACH
    REACH --> HEUR
    HEUR --> ASTAR
    TIE --> ASTAR
    INC -.-> ASTAR
    ASTAR --> CORR
    CORR --> STATE
    STATE --> TRANS
    TRANS --> BACK
    BACK --> PLAN
    PLAN --> SENS
```

## 2. Layered Component Responsibilities
1. **`src/api_client.py` (Hybrid Data Layer):** Queries live OpenChargeMap & OSRM endpoints if configured, falling back automatically to curated local JSON datasets (`data/*.json`) when offline or when no API key is present.
2. **`src/preprocessor.py` (Constraint Hygiene Layer):** Removes blocked roads (`is_blocked == True`), detects disconnected components, excludes offline stations (`is_available == False`), and clamps station power to the EV's maximum acceptance rate.
3. **`src/astar_router.py` (Part A — Heuristic Paradigm):** Computes the shortest feasible highway corridor using `A*` with an admissible Haversine heuristic, charger-power tie-breaking, and localized incremental path repair.
4. **`src/corridor_bridge.py` (Corridor Projection Layer):** Maps the 2D route into a 1D station sequence and verifies that no inter-station gap exceeds maximum usable battery capacity $(B_{\max} - B_{\min})$.
5. **`src/dp_charger.py` (Part B — Dynamic Programming Paradigm):** Solves the multi-stage charging stop and energy allocation problem via state table $DP[i][b]$ and reconstructs the exact charging schedule via parent pointer backtracking.
6. **`src/pipeline.py` & `ui/dashboard.py` (Part C — Integration & Visualization):** Orchestrates end-to-end execution, sensitivity analysis, and generates the free OpenStreetMap HTML dashboard.
