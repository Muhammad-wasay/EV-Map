# 🚀 VoltPath — How to Run & CEP Rubric Completion Status

**Project Title:** VoltPath — EV Trip Charging Planner  
**Course:** CT-363 — Design and Analysis of Algorithms (Complex Engineering Problem / CEP)  
**Department:** Computer Science & Information Systems (CSIT), NED University of Engineering and Technology  
**GitHub Repository:** [https://github.com/Muhammad-wasay/EV-Map](https://github.com/Muhammad-wasay/EV-Map)

---

## 👥 Team Members

| Student Name | Roll Number |
| :--- | :--- |
| **Muhammad Wasay Rafiq** | `CT-24236` |
| **Muhammad Sarim Umer** | `CT-24235` |
| **Muhammad Usman Masood** | `CT-24239` |
| **Muhammad Feras Malik** | `CT-24247` |

---

## 🛠️ Part 1: How to Run the Project (Step-by-Step Guide)

### Method A: 1-Click Automatic Startup (FastAPI + React)
Open PowerShell in the root folder (`DAA-PROJECT`) and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
.\start_app.ps1
```
*(This script automatically sets up/activates `venv`, starts the FastAPI Backend on `http://127.0.0.1:8000`, installs React dependencies if needed, and launches the React Frontend on `http://localhost:5173`).*

---

### Method B: Manual Setup with `venv` (Recommended for Viva / Evaluation)

#### Step 1: Create & Activate Python Virtual Environment (`Terminal 1`)
```powershell
# 1. Create virtual environment
python -m venv venv

# 2. Allow activation script in current PowerShell session & activate venv
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
.\venv\Scripts\Activate.ps1

# 3. Install backend dependencies inside venv
pip install -r requirements.txt
```

#### Step 2: Start the FastAPI Backend Server (`Terminal 1`)
```powershell
python -m uvicorn api.server:app --host 127.0.0.1 --port 8000 --reload
```
- **Backend URL:** `http://127.0.0.1:8000`
- **Interactive Swagger API Docs:** `http://127.0.0.1:8000/docs`

#### Step 3: Start the React + Vite Frontend (`Terminal 2`)
Open a second terminal in VS Code (`Ctrl + Shift + ` `) and run:
```powershell
cd frontend
npm install
npm run dev
```
- **React Dashboard URL:** Open **`http://localhost:5173`** in your browser.
- Look at the top-right status pill: it will display **`🟢 FastAPI Backend Connected (:8000)`**.
- *(Note: Even if the FastAPI server is stopped, the React frontend automatically switches to **`🟠 Client Mock Fallback Active`** so the UI never crashes!)*

---

### Method C: Run the Command-Line (CLI) Pipeline & Unit Tests
Inside your activated `(venv)` terminal:
```powershell
# Run full CLI demonstration (Worked Example + Incremental Repair + 3 Edge Cases + Sensitivity Test)
python main.py

# Test live API check with automatic fallback to local mock dataset
python main.py --use-api

# Run all 9 automated unit and CEP scenario tests
python -m unittest discover -s tests -v
```

---

## 📊 Part 2: CEP Rubric vs. Completed Tasks Comparison (100% Complete)

Below is the direct comparison between the **NED University CT-363 CEP PDF Rubric** and the implemented modules in **VoltPath**:

### 1. Complex Engineering Solving Attributes (WP1 – WP5 — 20 Marks Total)

| SNo / CLO | Rubric Attribute & Weight | Excellent (75–100%) Criteria from PDF | Status | Where It Is Implemented in VoltPath |
| :--- | :--- | :--- | :---: | :--- |
| **CLO-2 (10%)** | **WP1 – Depth of Engineering Knowledge** | States both real-world sub-problems clearly and links each to the correct algorithmic paradigm with sound theoretical justification. | ✅ **100% Done** | • **Sub-Problem A (Spatial Highway Routing):** Linked to Heuristic/Greedy Paradigm (`A*` Search) in [`src/astar_router.py`](src/astar_router.py).<br>• **Sub-Problem B (Charging Stop & Energy Allocation):** Linked to Dynamic Programming (`DP`) in [`src/dp_charger.py`](src/dp_charger.py).<br>• Theoretical justification documented in [`docs/complexity_and_proofs.md`](docs/complexity_and_proofs.md). |
| **CLO-3 (20%)** | **WP2 – Range of Conflicting Requirements** | Correctly reconciles conflicting constraints (cost vs. coverage vs. time-decay/speed vs. capacity) and justifies the trade-off chosen. | ✅ **100% Done** | Reconciles 4 conflicting engineering axes via Pareto-Optimal State-Space DP (`_prune_pareto_frontier` in [`src/dp_charger.py`](src/dp_charger.py)):<br>1. **Economic:** Tariff ($\text{PKR/kWh}$)<br>2. **Temporal:** Charger speed ($P_i$ kW) + queue wait vs. $T_{\max}$<br>3. **Technical:** Battery capacity cap $B_{\max}$<br>4. **Safety:** Mandatory arrival reserve $B_{\min} \ge 12\text{ kWh}$ |
| **CLO-3 (30%)** | **WP3 – Depth of Analysis Required** | Formulates a correct model for each paradigm (optimality / optimal-substructure proof) and derives the correct time & space complexity with justification. | ✅ **100% Done** | • **Admissibility & Consistency Proofs** for `A*` Haversine heuristic $h(n)$.<br>• **Optimal Substructure Proof** for multi-stage state recurrence $DP[i][b]$.<br>• **Exact Big-O Time & Space Complexity** vs. exponential Brute-Force ($B^k$) derived in [`docs/complexity_and_proofs.md`](docs/complexity_and_proofs.md) & displayed in React UI Tab 4. |
| **CLO-2 (40%)** | **WP5 – Extent of Applicable Code** | Correctly and efficiently implements both algorithms, passes all provided and edge-case test data, with clean pseudocode and code. | ✅ **100% Done** | • Complete Python engine (`src/`), FastAPI server (`api/`), React UI (`frontend/`), 9 automated unit tests (`tests/`), and formal pseudocode ([`docs/pseudocode.md`](docs/pseudocode.md)). |

---

### 2. Detailed Section-by-Section Requirements Checklist (Parts A, B, C & Deliverables)

| PDF Section | Requirement Description | Status | Verification & File Reference |
| :--- | :--- | :---: | :--- |
| **Part A.1** | Exclude every blocked/submerged road (`is_blocked == true`) before running the algorithm. | ✅ **100% Done** | `NetworkPreprocessor.build_active_adjacency_list()` in [`src/preprocessor.py`](src/preprocessor.py) filters out `N01->N04` and `N12->N14` before `A*` runs. Verified by `test_blocked_roads_excluded`. |
| **Part A.2** | Detect disconnected graphs, report isolated cities by name, and compute connected components instead of failing. | ✅ **100% Done** | `NetworkPreprocessor.analyze_connectivity()` in [`src/preprocessor.py`](src/preprocessor.py) detects isolated nodes (`Gilgit`, `Skardu`) and reports them cleanly. Verified by `test_edge_case_disconnected_graph`. |
| **Part A.3** | Implement an explicit, documented tie-breaking rule for identical-cost paths and justify it. | ✅ **100% Done** | `AStarRouter.find_optimal_route()` in [`src/astar_router.py`](src/astar_router.py) breaks $f(n)$ ties by preferring nodes with higher available charging power ($-P_u$ kW), then lower $h(u)$. |
| **Part A.4** | Prove optimality (Admissibility, Consistency & Optimal Substructure) in report documentation. | ✅ **100% Done** | Full mathematical proof written in [`docs/complexity_and_proofs.md`](docs/complexity_and_proofs.md) Section 1.1. |
| **Part A.5** | Derive exact Time & Space complexity in terms of $n$ ($|V|$) and $m$ ($|E|$) for adjacency list + priority queue. | ✅ **100% Done** | Derived as $\mathcal{O}((|V| + |E|)\log|V|)$ time and $\mathcal{O}(|V| + |E|)$ space in [`docs/complexity_and_proofs.md`](docs/complexity_and_proofs.md) Section 1.2. |
| **Part A.6** | **Extension Case:** Incremental route update when 3 additional roads become blocked without recomputing unaffected prefix from scratch, comparing cost vs. full scratch. | ✅ **100% Done** | `AStarRouter.incremental_route_update()` in [`src/astar_router.py`](src/astar_router.py) repairs from the local Divergence Node and reports `% nodes saved`. Interactive simulator in React UI Tab 2. |
| **Part B.1** | Multi-stage DP formulation (state definition, recurrence, base case) handling multiple stations and shared battery state across the trip. | ✅ **100% Done** | `DPChargingOptimizer._run_dp_table()` in [`src/dp_charger.py`](src/dp_charger.py) models states $(i, b)$ across $k$ stations and discrete kWh states $b \in [B_{\min}, B_{\max}]$. |
| **Part B.2** | Treat station power speeds, tariffs, and energy requirements as constants from input dataset. | ✅ **100% Done** | Loaded from [`data/highway_network.json`](data/highway_network.json) via [`src/api_client.py`](src/api_client.py). |
| **Part B.3** | **Edge Case:** Handle over-constrained trip where demand/time exceeds $T_{\max}$ — return best feasible fallback allocation instead of failing or returning zero. | ✅ **100% Done** | When $T_{\max} = 11.0\text{h}$ is impossible, `DPChargingOptimizer` automatically runs a `TIME_THEN_COST` fallback pass, returning the `17.69h` minimum-time plan with a diagnostic warning. |
| **Part B.4** | **Edge Case:** Automatically exclude offline stations (`is_available == false`) and clamp chargers exceeding EV max kW acceptance without breaking the recurrence. | ✅ **100% Done** | `NetworkPreprocessor.sanitize_chargers_for_ev()` excludes offline chargers (`Dadu`, `Kalat`, `Khuzdar`) and clamps $150\text{ kW}$ chargers to $120\text{ kW}$ EV max. |
| **Part B.5** | Reconstruct and print the actual station-by-station charging schedule (not just optimal cost) by backtracking through the DP table. | ✅ **100% Done** | Backtracks through `dp_table[i][curr_b][curr_p_idx]` parent pointers to output exact arrival SoC, departure SoC, $+\Delta\text{kWh}$, minutes, and PKR cost at each stop. |
| **Part B.6** | Derive exact Time & Space complexity of DP and compare against infeasible Brute-Force complexity. | ✅ **100% Done** | Derived as $\mathcal{O}(k \cdot B^2)$ vs. Brute-Force $\mathcal{O}(B^k) = 64^9 \approx 1.8 \times 10^{16}$ in [`docs/complexity_and_proofs.md`](docs/complexity_and_proofs.md) Section 2.2. |
| **Part C.1** | Combined pipeline worked example on $\ge 10$ cities and $\ge 20$ roads (ours has **14 cities and 24 roads**). | ✅ **100% Done** | Orchestrated by [`src/pipeline.py`](src/pipeline.py), printed in [`main.py`](main.py), and visualized in React UI Tab 1. |
| **Part C.2** | **Sensitivity Test:** Rerun pipeline after removing two major hubs and discuss how both `A*` and `DP` outputs change. | ✅ **100% Done** | `VoltPathPipeline.run_sensitivity_analysis()` disables `Hyderabad (N02)` & `Bahawalpur (N08)` + blocks `N08->N10`, shifting route through `Multan (N09)` (`1505 km -> 1565 km`, `PKR 11,012 -> PKR 12,044`). |
| **Bonus / Extra** | **Hybrid Live API + Automatic Mock Fallback** + **Full React/FastAPI UI Dashboard**. | ✅ **100% Done** | Implemented in [`src/api_client.py`](src/api_client.py), [`api/server.py`](api/server.py), and [`frontend/src/App.jsx`](frontend/src/App.jsx). |
