# ⚡ VoltPath — EV Trip Charging Planner

> **A Dual-Paradigm Decision-Support System for Electric Vehicle Route Discovery and Multi-Constraint Charging Schedule Optimization Using A\* Heuristic Search and Dynamic Programming**

**Institution:** NED University of Engineering and Technology  
**Department:** Computer Science and Information Systems (CSIT)  
**Course:** CT-363 — Design and Analysis of Algorithms (Complex Engineering Problem / CEP)  
**Repository:** [https://github.com/Muhammad-wasay/EV-Map](https://github.com/Muhammad-wasay/EV-Map)

---

## 👥 Team Members

| Name | Roll Number |
| :--- | :--- |
| **Muhammad Wasay Rafiq** | `CT-24236` |
| **Muhammad Sarim Umer** | `CT-24235` |
| **Muhammad Usman Masood** | `CT-24239` |
| **Muhammad Feras Malik** | `CT-24247` |

---

## 📌 Project Overview

**VoltPath** is an algorithmic decision-support system designed to help Electric Vehicle (EV) owners plan long-distance journeys across highway networks by computing an optimal driving route and selecting cost- and time-optimal charging stops.

In strict compliance with the **CT-363 Complex Engineering Problem (CEP)** guidelines, the system decomposes the real-world engineering problem into two core algorithmic paradigms working in tandem:

1. **Part A — Spatial Route Discovery (`A*` Heuristic Search Paradigm):**  
   Computes the optimal highway route between the starting city and destination using real GPS coordinates and an admissible **Haversine Great-Circle Heuristic** $h(n)$, while excluding blocked roads, handling tie-breaking via station power density, and supporting **incremental route repair** when roads close mid-trip.
2. **Part B — Charging Stop & Energy Allocation (`Dynamic Programming` Paradigm):**  
   Models the sequence of available charging stations along the `A*` route as a multi-stage state-space Dynamic Programming problem $DP[i][b]$. It determines **which stations to stop at** and **how much battery energy ($\Delta \text{kWh}$) to charge** at each stop, reconciling conflicting constraints:
   - **Technical:** Limited battery capacity ($B_{\max}$) and variable charger speeds ($P_i$ in kW: Level 2 AC, DC Fast, Ultra-Fast).
   - **Safety:** Mandatory minimum arrival battery reserve ($B_{\min}$, e.g., $\ge 15\%$ SoC) at every node and the final destination.
   - **Economic:** Variable electricity tariffs ($\text{PKR/kWh}$) across charging stations.
   - **Temporal:** Maximum allowed total trip duration ($T_{\max}$ = driving time + charging time + station queue overhead).
   - **Availability:** Filtering out offline, busy, or incompatible charging stations.

---

## 🌐 Hybrid API + Automatic Offline Mock Fallback Architecture

VoltPath includes a production-ready **External API Adapter Layer (`src/api_client.py`)** with **automatic fallback to local curated Mock/JSON datasets (`data/`)**:

- **Live API Mode (Zero-Key or Optional API Key):**
  - **OpenChargeMap REST API** (`https://api.openchargemap.io/v3/poi`): Fetches live EV charging station metadata (kW power, operational status, GPS coordinates). Uses `OPENCHARGEMAP_API_KEY` if configured.
  - **OSRM (Open Source Routing Machine) REST API** (`https://router.project-osrm.org`): Queries live highway distances & driving durations between GPS coordinates.
- **Automatic Mock Fallback Mode (Default / Offline / No Key):**
  - Whenever no API key is configured, the user is offline, or an endpoint is unreachable, `VoltPathAPIClient` **automatically falls back** to the curated mock datasets in `data/highway_network.json` (plus the 3 mandatory CEP edge-case datasets) with zero interruption.

---

## 📂 Project Folder Structure

```text
DAA-PROJECT/
├── README.md                          # Project documentation, setup, and CEP alignment guide
├── requirements.txt                   # Optional dependencies (100% free open-source libraries)
├── .env.example                       # Optional API configuration template (falls back to mock if omitted)
├── main.py                            # Main CLI entry point (runs Part A, Part B, Part C, API test & Edge Cases)
│
├── data/                              # Mock Fallback & CEP Benchmark Datasets
│   ├── highway_network.json           # Primary dataset (14 cities, 24 highway segments, EV chargers)
│   ├── edge_case_disconnected.json    # Edge Case 1: Disconnected road network / isolated cities
│   ├── edge_case_deadzone.json        # Edge Case 2: Inter-station distance > Max Usable Battery Range
│   └── edge_case_tight_time.json      # Edge Case 3: Over-constrained trip time (Min Time > T_max)
│
├── src/                               # Core Algorithmic & API Engine
│   ├── __init__.py
│   ├── models.py                      # Data classes: Node, RoadEdge, ChargingStation, EVProfile, TripPlan
│   ├── api_client.py                  # Hybrid API Client (OpenChargeMap + OSRM) with automatic Mock Fallback
│   ├── preprocessor.py                # Graph builder, blocked-road filter, reachability & charger validator
│   ├── astar_router.py                # Part A: A* Search, Haversine heuristic, tie-breaker, incremental repair
│   ├── corridor_bridge.py             # Projects 2D A* route into 1D station sequence & detects range dead-zones
│   ├── dp_charger.py                  # Part B: Multi-state DP table DP[i][b], recurrence solver & backtracking
│   └── pipeline.py                    # Part C: Integrated A* + DP pipeline & Sensitivity Analysis runner
│
├── tests/                             # Automated Unit & CEP Rubric Verification Suite
│   ├── __init__.py
│   ├── test_astar.py                  # Tests Part A: optimality, tie-breaking, incremental road closure
│   ├── test_dp.py                     # Tests Part B: DP state transitions, backtracking, charger exclusion
│   └── test_cep_scenarios.py          # End-to-end verification of all CEP rubric requirements & API fallback
│
├── ui/                                # Interactive Web Visualization Dashboard
│   ├── dashboard.py                   # Generates interactive HTML map (Leaflet.js + OpenStreetMap)
│   └── voltpath_map.html              # Generated interactive route & SoC profile visualization
│
└── docs/                              # CEP Academic Report & Formal Deliverables (6-Page Report Material)
    ├── architecture.md                # System Architecture, Block Diagrams & Sequence Flows
    ├── complexity_and_proofs.md       # WP1-WP3: Mathematical Formulation, Optimality Proofs & Big-O
    └── pseudocode.md                  # Clean, labeled pseudocode for Part A, Part B, and Part C
```

---

## 🧮 CEP Rubric Compliance Matrix (WP1 – WP5)

| Rubric Criterion | Weight | Implementation in VoltPath |
| :--- | :---: | :--- |
| **WP1: Depth of Engineering Knowledge** | **10%** | Clear mathematical decomposition into **Part A (`A*` Heuristic Search)** for spatial routing and **Part B (`Dynamic Programming`)** for multi-stage charging optimization. |
| **WP2: Range of Conflicting Requirements** | **20%** | Reconciles **Cost** ($\text{PKR/kWh}$) vs. **Time** (charger speed $P_i$ & trip cap $T_{\max}$) vs. **Capacity** ($B_{\max}$) vs. **Safety Reserve** ($B_{\min}$). |
| **WP3: Depth of Analysis** | **30%** | Formal proofs of **Admissibility & Consistency** for `A*` and **Optimal Substructure** for `DP`, plus exact time/space complexity vs. Brute Force in [`docs/complexity_and_proofs.md`](docs/complexity_and_proofs.md). |
| **WP5: Extent of Applicable Code** | **40%** | Modular, tested implementation with backtracking reconstruction, incremental route update, sensitivity analysis, API-to-mock fallback, and all mandatory edge-case tests. |

---

## 🚀 Quick Start & Commands

1. **Run the Complete CEP Pipeline (Worked Example + API Fallback Demo + 3 Edge Cases + Sensitivity Analysis + HTML Map):**
   ```bash
   python main.py
   ```
2. **Run with Live API Attempt (Automatically Falls Back to Mock if No Key/Offline):**
   ```bash
   python main.py --use-api
   ```
3. **Run Automated Unit & Edge-Case Verification Suite:**
   ```bash
   python -m unittest discover -s tests -v
   ```
