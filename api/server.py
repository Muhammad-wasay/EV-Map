"""
FastAPI Backend Server for VoltPath — EV Trip Charging Planner (NED CT-363 DAA CEP).

Exposes REST endpoints for the React Frontend:
  - GET  /api/health              : Server status & team metadata
  - GET  /api/network             : Full 14-city highway graph, stations & default EV specs
  - POST /api/plan                : Runs Part A (A*) + Part B (DP) for custom trip parameters
  - POST /api/incremental-update  : Runs Part A.6 incremental route repair on mid-trip closures
  - GET  /api/edge-cases          : Runs all 3 mandatory WP5 edge-case scenarios
  - GET  /api/sensitivity         : Runs Part C sensitivity analysis (disabling top hubs)
"""
from dataclasses import asdict
from typing import List, Optional, Tuple

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.api_client import VoltPathAPIClient
from src.astar_router import AStarRouter
from src.models import EVProfile
from src.pipeline import VoltPathPipeline
from src.preprocessor import NetworkPreprocessor

app = FastAPI(
    title="VoltPath EV Trip Charging Planner API",
    description="Dual-Paradigm A* + Dynamic Programming Engine (NED CT-363 DAA CEP)",
    version="1.0.0",
)

# Enable unrestricted CORS for local React (Vite) evaluation & deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PlanRequest(BaseModel):
    origin_id: str = "N01"
    dest_id: str = "N14"
    max_allowed_time_hours: float = 18.5
    battery_capacity_kwh: int = 75
    initial_soc_kwh: int = 65
    min_reserve_kwh: int = 12
    consumption_kwh_per_km: float = 0.18
    max_charge_acceptance_kw: float = 120.0
    use_live_api: bool = False
    dataset_path: Optional[str] = None


class IncrementalUpdateRequest(BaseModel):
    origin_id: str = "N01"
    dest_id: str = "N14"
    newly_blocked_edges: List[Tuple[str, str]] = [
        ("N08", "N10"),
        ("N03", "N06"),
        ("N07", "N09"),
    ]


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "project": "VoltPath — EV Trip Charging Planner",
        "course": "CT-363 Design and Analysis of Algorithms (CEP)",
        "institution": "NED University of Engineering and Technology",
        "team": [
            {"name": "Muhammad Wasay Rafiq", "roll_no": "CT-24236"},
            {"name": "Muhammad Sarim Umer", "roll_no": "CT-24235"},
            {"name": "Muhammad Usman Masood", "roll_no": "CT-24239"},
            {"name": "Muhammad Feras Malik", "roll_no": "CT-24247"},
        ],
    }


@app.get("/api/network")
def get_network(use_live_api: bool = False):
    client = VoltPathAPIClient(use_live_api=use_live_api)
    nodes, edges, ev, source = client.load_network_and_ev()
    return {
        "data_source": source,
        "api_logs": client.api_status_log,
        "default_ev": asdict(ev),
        "nodes": [asdict(n) for n in nodes.values()],
        "edges": [asdict(e) for e in edges],
    }


@app.post("/api/plan")
def compute_trip_plan(req: PlanRequest):
    pipeline = VoltPathPipeline(use_live_api=req.use_live_api)
    ev_custom = EVProfile(
        model_name="Custom Configured EV",
        battery_capacity_kwh=req.battery_capacity_kwh,
        initial_soc_kwh=req.initial_soc_kwh,
        min_reserve_kwh=req.min_reserve_kwh,
        consumption_kwh_per_km=req.consumption_kwh_per_km,
        max_charge_acceptance_kw=req.max_charge_acceptance_kw,
    )
    try:
        plan = pipeline.run_trip_planner(
            origin_id=req.origin_id,
            dest_id=req.dest_id,
            max_allowed_time_hours=req.max_allowed_time_hours,
            dataset_path=req.dataset_path,
            ev_override=ev_custom if req.dataset_path is None else None,
        )
        return {
            "plan": asdict(plan),
            "api_logs": pipeline.api_client.api_status_log,
        }
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/api/incremental-update")
def run_incremental_update(req: IncrementalUpdateRequest):
    client = VoltPathAPIClient(use_live_api=False)
    nodes, edges, _, _ = client.load_network_and_ev()
    adj, _ = NetworkPreprocessor.build_active_adjacency_list(nodes, edges)
    init_nodes, init_edges, init_metrics = AStarRouter.find_optimal_route(
        nodes, adj, req.origin_id, req.dest_id
    )
    if not init_nodes or not init_edges:
        raise HTTPException(status_code=400, detail="Initial route is disconnected.")

    inc_res = AStarRouter.incremental_route_update(
        nodes, edges, init_nodes, init_edges, req.newly_blocked_edges
    )
    updated_ids = inc_res.get("updated_path_nodes") or []
    return {
        "initial_route_ids": init_nodes,
        "initial_route_names": [nodes[nid].name for nid in init_nodes],
        "initial_distance_km": init_metrics.get("total_distance_km"),
        "newly_blocked_edges": req.newly_blocked_edges,
        "recomputed": inc_res.get("recomputed"),
        "reason": inc_res.get("reason", "Affected downstream branch repaired via local A*."),
        "divergence_node_id": inc_res.get("divergence_node"),
        "divergence_node_name": nodes[inc_res["divergence_node"]].name
        if inc_res.get("divergence_node") in nodes
        else None,
        "updated_route_ids": updated_ids,
        "updated_route_names": [nodes[nid].name for nid in updated_ids],
        "updated_distance_km": inc_res.get("updated_distance_km"),
        "incremental_nodes_expanded": inc_res.get("incremental_nodes_expanded"),
        "full_scratch_nodes_expanded": inc_res.get("full_scratch_nodes_expanded"),
        "nodes_saved_pct": inc_res.get("nodes_saved_pct", 0.0),
    }


@app.get("/api/edge-cases")
def run_all_edge_cases():
    pipeline = VoltPathPipeline(use_live_api=False)
    ec1 = pipeline.run_trip_planner(
        origin_id="N01", dest_id="N04", dataset_path="data/edge_case_disconnected.json"
    )
    ec2 = pipeline.run_trip_planner(
        origin_id="N01", dest_id="N04", dataset_path="data/edge_case_deadzone.json"
    )
    ec3 = pipeline.run_trip_planner(
        origin_id="N01", dest_id="N14", max_allowed_time_hours=11.0
    )
    return {
        "edge_cases": [
            {
                "id": "EC1",
                "title": "Edge Case 1: Disconnected Graph / Isolated Cities",
                "cep_ref": "Part A.2 & WP5",
                "description": "Karakoram Highway (N02 -> N03) is blocked by a landslide, isolating Gilgit and Skardu from Islamabad.",
                "result": asdict(ec1),
            },
            {
                "id": "EC2",
                "title": "Edge Case 2: Range Dead-Zone & Offline/Incompatible Chargers",
                "cep_ref": "Part B.4 & WP5",
                "description": "Intermediate stations at Kalat & Khuzdar are offline (is_available=false), creating a 300 km (60 kWh) gap that exceeds usable battery capacity (40 kWh).",
                "result": asdict(ec2),
            },
            {
                "id": "EC3",
                "title": "Edge Case 3: Over-Constrained Time Budget (T_trip > T_max)",
                "cep_ref": "Part B.3 & WP5",
                "description": "User requests Karachi -> Islamabad under T_max = 11.0 hrs, which is physically impossible even with ultra-fast charging. DP returns the minimum-time feasible fallback plan (17.69 hrs) with diagnostic.",
                "result": asdict(ec3),
            },
        ]
    }


@app.get("/api/sensitivity")
def run_sensitivity():
    pipeline = VoltPathPipeline(use_live_api=False)
    return pipeline.run_sensitivity_analysis()
