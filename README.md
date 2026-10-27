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

**VoltPath** is a full-stack algorithmic decision-support system (**React + Vite Frontend** powered by a **Python FastAPI Backend**) designed to help Electric Vehicle (EV) owners plan long-distance journeys across highway networks by computing an optimal driving route and selecting cost- and time-optimal charging stops.

In strict compliance with the **CT-363 Complex Engineering Problem (CEP)** guidelines, the system decomposes the real-world engineering problem into two core algorithmic paradigms working in tandem:

1. **Part A — Spatial Route Discovery (`A*` Heuristic Search Paradigm):**  
   Computes the optimal highway route between the starting city and destination using real GPS coordinates and an admissible **Haversine Great-Circle Heuristic** $h(n)$, while excluding blocked roads, handling tie-breaking via station power density, and supporting **incremental route repair** when roads close mid-trip.
2. **Part B — Charging Stop & Energy Allocation (`Dynamic Programming` Paradigm):**  
   Models the sequence of available charging stations along the `A*` route as a multi-stage Pareto State-Space Dynamic Programming problem $DP[i][b]$. It determines **which stations to stop at** and **how much battery energy ($\Delta \text{kWh}$) to charge** at each stop, reconciling conflicting constraints:
   - **Technical:** Limited battery capacity ($B_{\max}$) and variable charger speeds ($P_i$ in kW: Level 2 AC, DC Fast, Ultra-Fast).
   - **Safety:** Mandatory minimum arrival battery reserve ($B_{\min}$, e.g., $\ge 15\%$ SoC) at every node and the final destination.
   - **Economic:** Variable electricity tariffs ($\text{PKR/kWh}$) across charging stations.
   - **Temporal:** Maximum allowed total trip duration ($T_{\max}$ = driving time + charging time + station queue overhead).
   - **Availability:** Filtering out offline, busy, or incompatible charging stations.

---

## 🌐 Double-Layer Fallback Architecture (Zero Evaluation or Deployment Failures)

1. **Backend Hybrid API + Mock Fallback (`src/api_client.py`):**
   - Queries live **OpenChargeMap** and **OSRM** endpoints when enabled, and automatically falls back to local curated Mock datasets (`data/highway_network.json`) when no API key is configured or when offline.
2. **Frontend FastAPI + Client Mock Fallback (`frontend/src/App.jsx` & `mockFallback.js`):**
   - Connects directly to the local **FastAPI server (`http://127.0.0.1:8000`)** during live evaluation (`🟢 FastAPI Backend Connected (:8000)`).
   - If the FastAPI server is not running or the React app is deployed as a static site (e.g., on Vercel/Netlify), the frontend automatically falls back to its built-in client mock engine (`🟠 Client Mock Fallback Active`) so the UI never fails.

---

## 📂 Project Folder Structure

```text
DAA-PROJECT/
├── README.md                          # Project documentation, setup, and CEP alignment guide
├── requirements.txt                   # FastAPI, Uvicorn & Python dependencies
├── start_app.ps1                      # 1-Click launcher for FastAPI Backend (:8000) + React UI (:5173)
├── main.py                            # CLI runner (Part A, Part B, Part C, API test & Edge Cases)
│
├── api/                               # FastAPI REST Backend (for Local Evaluation with React)
│   ├── __init__.py
│   └── server.py                      # Endpoints: /api/plan, /api/incremental-update, /api/edge-cases, /api/sensitivity
│
├── frontend/                          # React + Vite + Leaflet.js Interactive Frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                    # 4-Tab CEP Dashboard (Planner, Incremental Repair, Edge Cases, Sensitivity)
│       ├── App.css
│       └── mockFallback.js            # Automatic client-side fallback dataset
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
│   ├── test_astar.py
│   ├── test_dp.py
│   └── test_cep_scenarios.py
│
└── docs/                              # CEP Academic Report & Formal Deliverables (6-Page Report Material)
    ├── architecture.md
    ├── complexity_and_proofs.md
    └── pseudocode.md
```

---

## 🚀 How to Run (FastAPI Backend + React Frontend)

### Option A: 1-Click Automatic Startup (PowerShell)
```powershell
.\start_app.ps1
```

### Option B: Manual 2-Terminal Startup (Recommended During Evaluation)

**Terminal 1 — Start the FastAPI Python Backend (`http://127.0.0.1:8000`):**
```powershell
pip install fastapi uvicorn pydantic requests
python -m uvicorn api.server:app --host 127.0.0.1 --port 8000 --reload
```
*(Interactive Swagger API Docs available at: `http://127.0.0.1:8000/docs`)*

**Terminal 2 — Start the React (Vite) Frontend (`http://localhost:5173`):**
```powershell
cd frontend
npm install
npm run dev
```
*(Then open `http://localhost:5173` in your browser!)*

### Option C: Run the CLI Pipeline & Automated Unit Tests
```powershell
python main.py
python -m unittest discover -s tests -v
```
