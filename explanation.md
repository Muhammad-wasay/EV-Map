# ⚡ VoltPath — Clear & Simple Explanation Guide

**Project Name:** VoltPath — EV Trip & Charging Planner  
**University:** NED University of Engineering & Technology (CSIT Department)  
**Course:** CT-363 Design and Analysis of Algorithms (Complex Engineering Problem / CEP)  
**Team Members:**  
- Muhammad Wasay Rafiq (`CT-24236`)  
- Muhammad Sarim Umer (`CT-24235`)  
- Muhammad Usman Masood (`CT-24239`)  
- Muhammad Feras Malik (`CT-24247`)  

---

# 📑 Table of Contents
1. [In Plain English: What is this project?](#1-in-plain-english-what-is-this-project)
2. [Why is this a hard problem? (The Real-World Issue)](#2-why-is-this-a-hard-problem-the-real-world-issue)
3. [Who is it made for?](#3-who-is-it-made-for)
4. [How does it work? (The 2 Algorithms Explained Simply)](#4-how-does-it-work-the-2-algorithms-explained-simply)
5. [The Safety Backup: Why this project never crashes](#5-the-safety-backup-why-this-project-never-crashes)
6. [Every Single File Explained Simply](#6-every-single-file-explained-simply)
7. [How to Deploy & Host this Project](#7-how-to-deploy--host-this-project)

---

# 1. In Plain English: What is this project?

Imagine you own an **Electric Vehicle (EV)**, like an MG ZS EV, a BYD, or a Tesla, and you want to drive from **Karachi to Islamabad** (around 1,500 kilometers).

If you were driving a normal petrol car, this trip would be easy: you just use Google Maps to find the shortest road, and whenever your fuel runs low, you stop at any petrol pump for 3 minutes.

**With an Electric Car, it is completely different:**
1. Your battery only lasts around 300 to 400 km on a single charge.
2. Charging pumps are not everywhere.
3. Chargers have different speeds (some take 30 minutes, others take 3 hours).
4. Electricity prices vary at different stations (some cost PKR 42 per unit, others cost PKR 68).
5. You must never let your battery hit 0% on a lonely highway, or you will be stranded!

**VoltPath is a smart journey planner website built specifically for EV drivers.**  
You tell it:
- Where you are starting (e.g., Karachi)
- Where you want to go (e.g., Islamabad)
- Your battery size and current charge (e.g., 75 kWh battery, starting with 65 kWh)
- The maximum time you want the trip to take (e.g., 18.5 hours)

**VoltPath then calculates:**
1. **The best highway route to take** (avoiding closed roads).
2. **Exactly which stations to stop at.**
3. **Exactly how many minutes to charge at each station** and **how much money it will cost**.
4. How much money you saved compared to buying petrol!

---

# 2. Why is this a hard problem? (The Real-World Issue)

Why can't Google Maps or normal map software solve this?

Because standard map apps only look at one thing: **the shortest road distance**.

An electric vehicle has many conflicting rules that must all be balanced at the same time:
- **Rule 1 (Never run out of charge):** You must always have at least 15% battery (a safety buffer) when arriving anywhere.
- **Rule 2 (Battery limit):** You cannot put more charge into a battery than its maximum size ($B_{\max}$).
- **Rule 3 (Speed vs Cost):** Superfast chargers get you back on the road quickly, but they are expensive. Slower chargers are cheaper, but make your trip take longer.
- **Rule 4 (Total Time Limit):** You have a deadline (e.g., "I must arrive within 18.5 hours"). Driving time + charging time + waiting in line cannot exceed this deadline.

Trying every possible combination by hand or with a simple computer loop would take **billions of years** (literally millions of combinations). VoltPath uses **smart computer science algorithms** to find the exact cheapest and fastest plan in **less than 1 second**.

---

# 3. Who is it made for?

1. **EV Owners in Pakistan:** Anyone driving an electric car between cities (such as Karachi, Sukkur, Rahim Yar Khan, Multan, Lahore, Islamabad) who doesn't want to get stuck on the motorway with a dead battery.
2. **Delivery & Logistics Companies:** Delivery fleets (like electric vans or trucks) who need to calculate the exact electricity cost, motorway tolls, and schedule for long routes.
3. **University Evaluators (NED University):** Built as a "Complex Engineering Problem" (CEP) for the **Design and Analysis of Algorithms (CT-363)** course, showing how to apply famous computer science algorithms ($A^*$ Search and Dynamic Programming) to solve a real-life engineering challenge.

---

# 4. How does it work? (The 2 Algorithms Explained Simply)

Instead of trying to solve the roads and the charging all at once, VoltPath splits the job into **two clean steps**:

```
Step 1: Find the Best Road (Part A: A* Search)
       │
       ▼
Step 2: Decide Where & How Much to Charge (Part B: Dynamic Programming)
       │
       ▼
Final Output: Complete Trip Schedule on an Interactive Map!
```

---

### Step 1: Finding the Best Road — Part A: $A^*$ (A-Star) Algorithm

**What it does:**  
Finds the shortest, fastest highway route from your start city to your destination city, ignoring blocked roads.

**How it works:**
- Normal GPS routing (like Dijkstra's algorithm) searches blindly in circles like water spreading across a floor.
- **$A^*$ is much smarter:** It uses a "compass guide" called a **heuristic**.
- For every city on the map, it calculates the straight-line distance ("as the crow flies") to the destination using real Earth GPS coordinates (called the **Haversine formula**).
- Because straight-line distance through the air is always shorter than driving on a winding highway, this guide is **100% honest and never overestimates**. In computer science, this is called **Admissible**.
- Thanks to this, $A^*$ moves straight toward the destination without wasting time checking cities in the wrong direction.

**The Clever Tie-Breaker Rule:**  
What if two highway routes have the exact same distance?  
VoltPath checks which city has **bigger, more powerful EV chargers**. It picks the road with better chargers just in case you need electricity!

**Mid-Trip Road Closure (Incremental Repair):**  
What if a motorway section gets closed (e.g., due to an accident or protest) after you already started driving?  
Instead of restarting the entire calculation from your starting city, VoltPath freezes the road you already drove on and **only recalculates the remaining broken piece**. This saves computer power and recalculates in milliseconds.

---

### Step 2: Deciding Where & How Much to Charge — Part B: Dynamic Programming

Now that Step 1 gave us the road (e.g., Karachi $\to$ Hyderabad $\to$ Nawabshah $\to$ Sukkur $\to$ ... $\to$ Islamabad), we have a line of charging stations.

Now we must decide:
- *Do we stop at Nawabshah, or can we make it to Sukkur?*
- *If we stop at Sukkur, should we charge for 20 minutes (just enough to reach the next stop) or 45 minutes (to fill up completely because electricity is cheap here)?*

**Why brute-force guessing fails:**  
If there are 10 stations, and at each station you can choose to put in 0 kWh, 1 kWh, 2 kWh ... up to 60 kWh, there are $64^{10}$ combinations. That is **1,150,000,000,000,000,000 possibilities**! A regular computer would freeze forever trying to check them all.

**How Dynamic Programming (DP) solves it:**  
Dynamic Programming uses a smart memory table.  
It solves the problem step by step:
1. *From Karachi to Hyderabad:* What is the cheapest way to arrive with 20% battery? With 30%? With 40%? It saves these answers in a table.
2. *From Hyderabad to Nawabshah:* It uses the answers already saved in the table instead of recalculating from scratch!
3. It repeats this from city to city, always making sure:
   - Your battery never dips below 15% ($B_{\min}$).
   - You never exceed your battery limit ($B_{\max}$).
   - Your total journey time stays under your deadline ($T_{\max}$).
4. When it reaches Islamabad, it looks at the final answer and **traces backward** to print your exact receipt:
   - *"Stop at Nawabshah: Charge 60 kWh (takes 1 hour 36 mins, costs PKR 2,520)"*
   - *"Stop at Sukkur: Charge 13 kWh (takes 12 mins, costs PKR 806)"*
   - *"Skip Moro entirely because you already have enough battery!"*

---

# 5. The Safety Backup: Why this project never crashes

Most web apps crash if the backend server is turned off or if the internet is disconnected.

VoltPath has a **Double-Layer Safety Fallback**:
1. **The Backend (Python + FastAPI):** Runs the heavy math and can connect to real-life live EV charger databases (OpenChargeMap).
2. **The Frontend Fallback (JavaScript in the browser):** If the Python backend is closed, or if you deploy this project on a free website host like Vercel or Netlify without any Python server, **the React website has the exact same $A^*$ and Dynamic Programming algorithms written directly inside JavaScript (`mockFallback.js`)!**

The website simply switches to **"Autonomous Mode"** and does all the math directly inside your browser in 0.05 seconds. It never shows an error screen!

---

# 6. Every Single File Explained Simply

Here is what every file in the project actually does, written in everyday words:

---

### 📂 Root Directory (Configuration & Starters)

- **[`main.py`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/main.py):**  
  The main Python command-line program. If you don't want to open the web browser and just want to see the algorithms run in your terminal, you run `python main.py`. It runs the trip from Karachi to Islamabad, prints the receipt, tests edge cases, and creates a standalone HTML map file (`ui/voltpath_map.html`).
- **[`requirements.txt`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/requirements.txt):**  
  The list of Python packages needed for the backend (`fastapi` for the API, `uvicorn` to run the server, `pydantic` for data checks, `requests` to fetch web data).
- **[`start_app.ps1`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/start_app.ps1):**  
  A 1-click automatic startup script for Windows PowerShell. You run this, and it automatically sets up Python, installs libraries, starts the backend on port 8000, and opens the frontend on port 5173.
- **[`run_project.bat`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/run_project.bat):**  
  A double-clickable file for Windows. Just double-click it on your desktop, and it launches `start_app.ps1` for you.
- **[`.env.example`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/.env.example) & [`.env`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/.env):**  
  Settings files where you can paste an optional OpenChargeMap API key if you want live charger data from the internet.
- **[`HOW_TO_RUN_AND_RUBRIC_STATUS.md`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/HOW_TO_RUN_AND_RUBRIC_STATUS.md):**  
  A grading checklist for university teachers and students showing how every single requirement of the CT-363 assignment was completed.

---

### 📂 `src/` (The Core Python Brain)

- **[`src/models.py`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/src/models.py):**  
  The "blueprints" (Data Classes). Defines what a City (`Node`), a Road (`RoadEdge`), a Charging Station (`ChargingStation`), an Electric Car (`EVProfile`), and a Final Trip Plan (`TripPlan`) look like in code.
- **[`src/preprocessor.py`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/src/preprocessor.py):**  
  The "cleaner". Before calculating any route, this file removes blocked roads, checks if any cities are cut off by landslides, flags broken or offline chargers, and makes sure a station's power doesn't exceed what your car can handle.
- **[`src/astar_router.py`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/src/astar_router.py):**  
  **Part A ($A^*$ Algorithm).** Contains the Haversine Earth distance formula, the priority queue (min-heap), the tie-breaker for charger power, and the code that quickly recalculates routes if a road gets blocked midway.
- **[`src/corridor_bridge.py`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/src/corridor_bridge.py):**  
  The "safety bridge". Takes the road path from $A^*$ and lines up all the charging stations along it. **Crucially, it checks for "Dead-Zones":** if the distance between two chargers is longer than your car's maximum battery range, it immediately alerts you that the trip is impossible with this car!
- **[`src/dp_charger.py`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/src/dp_charger.py):**  
  **Part B (Dynamic Programming Algorithm).** Builds the $DP[i][b]$ table, figures out the cheapest stations to stop at, calculates the exact minutes to charge, makes sure you arrive before your deadline, and traces the parent pointers backward to generate your final itinerary.
- **[`src/pipeline.py`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/src/pipeline.py):**  
  The "conductor". Connects the cleaner, the $A^*$ router, the bridge, and the DP charger together so you can run the whole trip with one simple function call: `run_trip_planner()`.
- **[`src/api_client.py`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/src/api_client.py):**  
  The "data fetcher". Tries to get live charger info from the internet. If there's no internet, no API key, or the server is slow, it smoothly loads the local file `data/highway_network.json` so the app never fails.

---

### 📂 `api/` (The Backend Server)

- **[`api/server.py`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/api/server.py):**  
  Built with **FastAPI**. It lets the React frontend talk to the Python algorithms over the local network:
  - `GET /api/health` $\to$ Returns "Server OK" and student names.
  - `GET /api/network` $\to$ Returns the 14 cities and highway connections.
  - `POST /api/plan` $\to$ Takes your start, destination, and battery settings, runs $A^*$ + DP, and sends back the result.
  - `POST /api/incremental-update` $\to$ Tests road closures.
  - `GET /api/edge-cases` $\to$ Tests the 3 tricky scenarios (landslides, dead-zones, tight deadlines).

---

### 📂 `data/` (The Maps & Scenarios)

- **[`data/highway_network.json`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/data/highway_network.json):**  
  The main map of Pakistan's motorways (M-9, N-5, M-5, M-4, M-3, M-2) connecting 14 cities from Karachi (N01) to Islamabad (N14), complete with real GPS coordinates, distances, speeds, and charger tariffs.
- **[`data/edge_case_disconnected.json`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/data/edge_case_disconnected.json):**  
  A test map where a landslide blocks the Karakoram highway, testing how the system handles isolated cities.
- **[`data/edge_case_deadzone.json`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/data/edge_case_deadzone.json):**  
  A test map where chargers between Quetta and Gwadar are offline, testing how the system stops you from getting stranded in a 300 km dead-zone.
- **[`data/edge_case_tight_time.json`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/data/edge_case_tight_time.json):**  
  A test scenario where the user gives an impossible deadline (e.g., Karachi to Islamabad in 11 hours), testing how the system returns the fastest possible fallback plan.

---

### 📂 `frontend/` (The Visual Website)

- **[`frontend/src/App.jsx`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/frontend/src/App.jsx):**  
  The main React component. It draws:
  - The top navigation bar with the animated letters and logo.
  - The **Live OpenStreetMap (Leaflet.js)** showing Pakistan with road lines, glowing route corridors, and clickable charger pins.
  - The **Vector Corridor map** (an alternative clean schematic view).
  - The left control drawer where you pick origin/destination, adjust battery sliders, and see your fuel savings compared to petrol!
  - It also automatically pings the Python backend; if Python isn't running, it seamlessly switches to the built-in browser engine.
- **[`frontend/src/mockFallback.js`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/frontend/src/mockFallback.js):**  
  The client-side brain! Contains a fast JavaScript implementation of:
  - A custom binary `MinHeap` class (so $A^*$ runs super fast).
  - The Haversine GPS distance formula.
  - The $A^*$ search and dynamic charging scheduler.
  - This file ensures the frontend works 100% on its own, even without Python installed.
- **[`frontend/src/ChargingNetworkView.jsx`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/frontend/src/ChargingNetworkView.jsx):**  
  The second tab: A searchable directory of all charging stations along Pakistan's motorways, showing kW power, cost per kWh, and whether they are online.
- **[`frontend/src/SavedTripsAnalyticsView.jsx`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/frontend/src/SavedTripsAnalyticsView.jsx):**  
  The third tab: Shows saved trips, carbon emissions saved (CO₂ reduction), and cost comparisons.
- **[`frontend/src/VehicleSpecsTelemetryView.jsx`](file:///c:/Users/HP/3D%20Objects/projects/EV-Map/frontend/src/VehicleSpecsTelemetryView.jsx):**  
  The fourth tab: Lets you pick different electric cars (Tesla Model 3, BYD Atto 3, MG4, Deepal, Porsche Taycan) and adjusts battery capacity and charging speeds automatically.

---

### 📂 `tests/` (Automated Quality Checks)

- **`test_astar.py`:** Tests that $A^*$ never cheats on distances and always avoids blocked roads.
- **`test_dp.py`:** Tests that the Dynamic Programming schedule never lets your battery drop below the safety limit and never exceeds your time deadline.
- **`test_cep_scenarios.py`:** Runs all 9 comprehensive tests covering normal trips and tricky edge cases (landslides, dead-zones, tight time budgets). All tests pass 100%.

---

# 7. How to Deploy & Host this Project

You can host this project on the internet so anyone can open it on their phone or laptop:

### Option A: The Super-Easy Way (Host on Vercel or Netlify for Free)
Because the frontend has its own built-in $A^*$ and DP algorithms inside `mockFallback.js`, **you do not even need a Python server to put this website online!**

1. Install Vercel CLI (or connect your GitHub repo to [vercel.com](https://vercel.com)):
   ```bash
   cd frontend
   npx vercel
   ```
2. When asked:
   - Framework: **Vite**
   - Build command: `npm run build`
   - Output folder: `dist`
3. Done! Vercel gives you a free `https://voltpath.vercel.app` link that anyone in the world can open. It will run in **Autonomous Mode** smoothly.

---

### Option B: The Full-Stack Way (Python Backend on Render + Website on Vercel)
If you want both the Python server and the website running live on the internet:

1. **Deploy Python Backend:**
   - Go to [render.com](https://render.com) (free).
   - Create a **New Web Service** and connect your GitHub repository.
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn api.server:app --host 0.0.0.0 --port $PORT`
   - Render gives you a backend URL like `https://voltpath-api.onrender.com`.

2. **Deploy Frontend:**
   - Deploy `frontend/` on Vercel or Netlify.
   - It will automatically connect to your Render backend to compute routes!


  
I’ll map the repository structure and identify algorithmic code, then trace each relevant file and summarize exact time/space costs.

Find files matching `**/*.{js,jsx,ts,tsx,py,java,cs,cpp,c,h,html,css,json,md}`

Requested chat rename
Completed with input: {
  "title": "Algorithm Complexity Analysis",
  "automatic": true
}

Read 
Completed with input: {
  "path": "C:\\Users\\HP\\3D Objects\\projects\\EV-Map\\docs\\complexity_and_proofs.md"
}

Read 
Completed with input: {
  "path": "C:\\Users\\HP\\3D Objects\\projects\\EV-Map\\src\\astar_router.py"
}

Read 
Completed with input: {
  "path": "C:\\Users\\HP\\3D Objects\\projects\\EV-Map\\src\\dp_charger.py"
}

Read 
Completed with input: {
  "path": "C:\\Users\\HP\\3D Objects\\projects\\EV-Map\\src\\preprocessor.py"
}

Read 
Completed with input: {
  "path": "C:\\Users\\HP\\3D Objects\\projects\\EV-Map\\src\\pipeline.py"
}

Read 
Completed with input: {
  "path": "C:\\Users\\HP\\3D Objects\\projects\\EV-Map\\src\\corridor_bridge.py"
}

Read 
Completed with input: {
  "path": "C:\\Users\\HP\\3D Objects\\projects\\EV-Map\\src\\api_client.py"
}

Read 
Completed with input: {
  "path": "C:\\Users\\HP\\3D Objects\\projects\\EV-Map\\src\\models.py"
}

Search for `sort\(|sorted\(|for |while |heap|deque|range\(`

Read 
Completed with input: {
  "path": "C:\\Users\\HP\\3D Objects\\projects\\EV-Map\\tests\\test_astar.py"
}

Read 
Completed with input: {
  "path": "C:\\Users\\HP\\3D Objects\\projects\\EV-Map\\tests\\test_dp.py"
}

The core algorithmic review is complete; I’m also checking UI/API paths so the report separates the Python routing engine from presentation-only operations.

Read 
Completed with input: {
  "path": "C:\\Users\\HP\\3D Objects\\projects\\EV-Map\\main.py"
}

Read 
Completed with input: {
  "path": "C:\\Users\\HP\\3D Objects\\projects\\EV-Map\\api\\server.py"
}

Read 
Completed with input: {
  "path": "C:\\Users\\HP\\3D Objects\\projects\\EV-Map\\frontend\\src\\mockFallback.js"
}

Read 
Completed with input: {
  "path": "C:\\Users\\HP\\3D Objects\\projects\\EV-Map\\frontend\\src\\App.jsx"
}

Read , lines 1 to 220
Completed with input: {
  "path": "C:\\Users\\HP\\3D Objects\\projects\\EV-Map\\README.md",
  "view_range": [
    1,
    220
  ]
}

Read , lines 1 to 180
Completed with input: {
  "path": "C:\\Users\\HP\\3D Objects\\projects\\EV-Map\\docs\\pseudocode.md",
  "view_range": [
    1,
    180
  ]
}

Read , lines 1 to 180
Completed with input: {
  "path": "C:\\Users\\HP\\3D Objects\\projects\\EV-Map\\docs\\architecture.md",
  "view_range": [
    1,
    180
  ]
}

Search for `def build_active_adjacency_list|def analyze_connectivity|def sanitize_charger...`

Search for `def find_optimal_route|while open_heap|for nbr_id|def incremental_route_updat...`

Search for `def extract_corridor|for edge in path_edges|for seg in segments`

Search for `def _prune_pareto_frontier|def _run_dp_table|for i in range|for b_arr|for del...`

Search for `def run_trip_planner|build_active_adjacency|find_optimal_route|extract_corrid...`

Search for `def load_network_and_ev|for n in|edges:|def _read_local_mock_json`

## 1. Core complexity summary

| Algorithm/module | Time complexity | Space complexity |
|---|---:|---:|
| JSON loading | $O(V+E)$ | $O(V+E)$ |
| Adjacency construction | $O(V+E)$ | $O(V+E)$ |
| Origin reachability/BFS | $O(V+E)$ | $O(V)$ |
| All connected components | $O(V+E)$ | $O(V)$ |
| Charger sanitization | $O(V)$ | $O(V)$ |
| A* route search | $O((V+E)\log V)$ | $O(V+E)$ |
| Corridor extraction | $O(k)$ | $O(k)$ |
| DP charging optimization | $O(kB^3\log B)$ worst case | $O(kB)$ plus working storage |
| Backtracking | $O(k)$ | $O(k)$ |
| Integrated pipeline | $O((V+E)\log V+kB^3\log B)$ | $O(V+E+kB)$ |

Where:

- $V$: number of cities/nodes
- $E$: number of road edges
- $k$: number of corridor nodes or segments
- $B=B_{\max}-B_{\min}+1$: number of battery states

---

## 2. A* route discovery

Implemented in `src/astar_router.py`.

### Operations

- Initializing `g_score` for every node: $O(V)$.
- Each node may be added to and popped from the heap.
- Each node heap operation costs $O(\log V)$.
- Each active edge is examined once from a popped node.

Therefore:

\[
T_{\text{A*}} = O(V\log V+E\log V)
             = O((V+E)\log V)
\]

The heap, `g_score`, parent maps, and closed set require:

\[
S_{\text{A*}}=O(V+E)
\]

The reconstruction function follows parent pointers in `src/astar_router.py`. A route can contain at most $V$ nodes and $V-1$ edges:

\[
T_{\text{reconstruction}}=O(V), \qquad S=O(V)
\]

The Haversine heuristic is constant-time work per node:

\[
T_{\text{Haversine}}=O(1)
\]

### Graph pre-processing

Adjacency construction in `src/preprocessor.py`:

- Iterates every edge.
- Creates the reverse edge for bidirectional traversal.

\[
T=O(V+E), \qquad S=O(V+E)
\]

Reachability analysis and component discovery each use BFS/DFS in `src/preprocessor.py`:

\[
T=O(V+E), \qquad S=O(V)
\]

Sorting node IDs while reporting isolated nodes adds $O(V\log V)$:

\[
T_{\text{connectivity}}=O(V\log V+E)
\]

Charger sanitization is linear in the number of nodes in `src/preprocessor.py`:

\[
O(V)
\]

---

## 3. Incremental A* route repair

Implemented in `src/astar_router.py`.

It:

1. Rebuilds blocked-edge information: $O(E)$.
2. Rebuilds the adjacency list: $O(V+E)$.
3. Finds the first blocked route edge: $O(k)$ or $O(V)$.
4. Potentially runs multiple localized A* searches.
5. Runs one full A* recomputation for comparison.

Let $r$ be the number of divergence attempts made by the backtracking loop in `src/astar_router.py`.

\[
T_{\text{incremental}}
=O(V+E+r(V+E)\log V)
=O(r(V+E)\log V)
\]

In the worst case $r=V$ if it backtracks through the entire prefix, so the theoretical upper bound is:

\[
O(V(V+E)\log V)
\]

In normal use only a few nearby divergence attempts are expected. The method then uses $O(V+E)$ memory.

---

## 4. Corridor extraction

Implemented in `src/corridor_bridge.py`.

- One pass creates one segment for each route edge.
- One pass checks cumulative range along the same route.

If the route contains $k$ corridor nodes:

\[
T_{\text{corridor}}=O(k)
\]

The segment list and corridor state require:

\[
S_{\text{corridor}}=O(k)
\]

The range-dead-zone check itself does not search or recurse, so it adds no higher-order cost.

---

## 5. Dynamic programming charging optimizer

Implemented in `src/dp_charger.py`.

The DP has:

- $k-1$ corridor transitions.
- $B$ possible battery states.
- Up to $B$ charge increments.
- A Pareto frontier of possible `(cost, time)` states for each battery state.

### Naive documented bound

If only one state exists per battery level:

\[
T_{\text{DP}}=O(kB^2)
\]

This is approximately the bound in `docs/complexity_and_proofs.md`.

### Actual implementation bound

Because the implementation stores a list of Pareto candidates, each battery level can have up to $B$ frontier states.

For each corridor stage:

- Up to $B$ arrival battery states.
- Up to $B$ charge increments.
- Up to $B$ Pareto states at one battery level.
- Each candidate is inserted and then sorted/pruned.

This gives the conservative actual bound:

\[
T_{\text{DP}}=O(kB^3\log B)
\]

The difference exists because `src/dp_charger.py` uses Pareto frontiers, not a scalar cost/time pair per battery state.

The implementation also can run the DP twice:

- First pass minimizing cost under the time limit.
- Fallback pass minimizing time if the first pass is infeasible.

Thus the worst-case two-pass cost is:

\[
O(2kB^3\log B)=O(kB^3\log B)
\]

### DP space

The DP table contains $k\times B$ battery entries, each holding a list:

\[
S_{\text{DP,table}}=O(kB)
\]

Candidate lists add up to $O(B^2)$ temporary working storage at a particular battery transition. Therefore:

\[
S_{\text{DP,practical}}=O(kB+B^2)
\]

For the 14-node dataset, $k$ and $B$ are small, so practical runtime remains low.

### Backtracking

Schedule reconstruction in `src/dp_charger.py`:

- Moves backward through $k$ corridor stages.
- Reads one parent tuple per stage.

\[
T_{\text{backtracking}}=O(k), \qquad S_{\text{backtracking}}=O(k)
\]

---

## 6. Integrated pipeline

In `src/pipeline.py`, a normal trip plan performs:

1. Load JSON: $O(V+E)$.
2. Build adjacency: $O(V+E)$.
3. Analyze components: $O(V\log V+E)$.
4. Sanitize chargers: $O(V)$.
5. Run A*: $O((V+E)\log V)$.
6. Extract corridor: $O(k)$.
7. Run DP: $O(kB^3\log B)$.

Dropping lower-order terms:

\[
T_{\text{pipeline}}
=
O((V+E)\log V+kB^3\log B)
\]

Space:

\[
S_{\text{pipeline}}=O(V+E+kB+B^2)
\]

In the specific 14-city dataset, $V=14$, $E\approx24$, and $k$ is small, so the DP battery-state size dominates practical behavior.

---

## 7. API and frontend

- Dataset loading in `src/api_client.py` is $O(V+E)$.
- API serialization converts nodes, edges, and station objects to dictionaries.
- FastAPI endpoint execution adds request/response serialization costs proportional to the returned network size.
- Live API calls add network latency but do not alter the in-memory algorithmic complexity.
- The React and mock-frontend code performs UI rendering and static data lookup rather than implementing additional graph or DP algorithms.
- Sensitivity analysis reruns A* and DP once after modifying two hubs and blocking one road, so it has constant-factor pipeline complexity: $O((V+E)\log V+kB^3\log B)$.
