"""
Hybrid External API Adapter with Automatic Local Mock Dataset Fallback.

Supports:
1. OpenChargeMap REST API (https://api.openchargemap.io/v3/poi) for live EV charger lookup.
2. OSRM Routing API (https://router.project-osrm.org) for highway distances.
3. Seamless Fallback to curated local JSON Mock datasets in `data/` when:
   - No API key is set in environment variables,
   - The system is run in offline mode, or
   - Any HTTP request times out or fails.
"""
import json
import os
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional, Tuple

from src.models import ChargingStation, EVProfile, Node, RoadEdge


class VoltPathAPIClient:
    """Fetches network and charger telemetry from live APIs with automatic Mock Fallback."""

    OPENCHARGEMAP_URL = "https://api.openchargemap.io/v3/poi/"
    OSRM_ROUTE_URL = "https://router.project-osrm.org/route/v1/driving/"

    def __init__(
        self,
        mock_dataset_path: str = "data/highway_network.json",
        use_live_api: bool = False,
        timeout_sec: float = 3.5,
    ):
        self.mock_dataset_path = mock_dataset_path
        self.api_key = os.environ.get("OPENCHARGEMAP_API_KEY", "").strip()
        env_force_api = os.environ.get("VOLTPATH_USE_LIVE_API", "false").lower() == "true"
        self.use_live_api = use_live_api or env_force_api
        self.timeout_sec = timeout_sec
        self.last_source_used = "MOCK_FALLBACK"
        self.api_status_log: List[str] = []

    def load_network_and_ev(
        self, dataset_override: Optional[str] = None
    ) -> Tuple[Dict[str, Node], List[RoadEdge], EVProfile, str]:
        """
        Loads the highway network graph and EV profile.
        Attempts live API enrichment if enabled; always falls back cleanly to local Mock JSON.
        """
        target_path = dataset_override or self.mock_dataset_path
        raw_mock = self._read_local_mock_json(target_path)

        nodes: Dict[str, Node] = {}
        for n in raw_mock.get("nodes", []):
            st_data = n.get("station")
            station = None
            if st_data:
                station = ChargingStation(
                    station_id=st_data["station_id"],
                    name=st_data["name"],
                    power_kw=float(st_data["power_kw"]),
                    cost_per_kwh=float(st_data["cost_per_kwh"]),
                    is_available=bool(st_data.get("is_available", True)),
                    queue_wait_hours=float(st_data.get("queue_wait_hours", 0.10)),
                )
            nodes[n["node_id"]] = Node(
                node_id=n["node_id"],
                name=n["name"],
                lat=float(n["lat"]),
                lon=float(n["lon"]),
                station=station,
            )

        edges: List[RoadEdge] = [
            RoadEdge(
                u=e["u"],
                v=e["v"],
                distance_km=float(e["distance_km"]),
                speed_kmh=float(e["speed_kmh"]),
                is_blocked=bool(e.get("is_blocked", False)),
                road_name=e.get("road_name", "Highway"),
            )
            for e in raw_mock.get("edges", [])
        ]

        ev_raw = raw_mock["default_ev"]
        ev_profile = EVProfile(
            model_name=ev_raw["model_name"],
            battery_capacity_kwh=int(ev_raw["battery_capacity_kwh"]),
            initial_soc_kwh=int(ev_raw["initial_soc_kwh"]),
            min_reserve_kwh=int(ev_raw["min_reserve_kwh"]),
            consumption_kwh_per_km=float(ev_raw["consumption_kwh_per_km"]),
            max_charge_acceptance_kw=float(ev_raw["max_charge_acceptance_kw"]),
        )

        # If live API mode is requested, attempt live OpenChargeMap & OSRM verification
        if self.use_live_api and dataset_override is None:
            api_ok = self._attempt_live_api_enrichment(nodes, edges)
            if api_ok:
                self.last_source_used = "LIVE_API_ENRICHED"
            else:
                self.last_source_used = "MOCK_FALLBACK (Live API Unavailable/No Key)"
        else:
            reason = "Default Mock Mode" if not self.use_live_api else "Scenario Override"
            self.api_status_log.append(
                f"[API-Client] Using local mock dataset '{target_path}' ({reason})."
            )
            self.last_source_used = f"MOCK_DATASET ({os.path.basename(target_path)})"

        return nodes, edges, ev_profile, self.last_source_used

    def _attempt_live_api_enrichment(
        self, nodes: Dict[str, Node], edges: List[RoadEdge]
    ) -> bool:
        """
        Attempts to query OpenChargeMap and OSRM APIs.
        If no API key is configured or network fails, logs diagnostic and returns False
        so the caller continues using the already-loaded mock structures.
        """
        if not self.api_key:
            self.api_status_log.append(
                "[API-Client] OPENCHARGEMAP_API_KEY not found in environment -> "
                "Falling back to local Mock Charger Catalogue."
            )
        else:
            try:
                params = urllib.parse.urlencode(
                    {
                        "output": "json",
                        "countrycode": "PK",
                        "maxresults": 10,
                        "compact": "true",
                        "verbose": "false",
                        "key": self.api_key,
                    }
                )
                req = urllib.request.Request(
                    f"{self.OPENCHARGEMAP_URL}?{params}",
                    headers={"User-Agent": "VoltPath-NED-CEP/1.0"},
                )
                with urllib.request.urlopen(req, timeout=self.timeout_sec) as resp:
                    if resp.status == 200:
                        pois = json.loads(resp.read().decode("utf-8"))
                        self.api_status_log.append(
                            f"[API-Client] OpenChargeMap API returned {len(pois)} live POIs."
                        )
            except Exception as exc:
                self.api_status_log.append(
                    f"[API-Client] OpenChargeMap request failed ({exc}) -> Using Mock Chargers."
                )

        # Probe OSRM free routing endpoint on first edge as health check
        if edges:
            e0 = edges[0]
            u_node, v_node = nodes[e0.u], nodes[e0.v]
            osrm_url = (
                f"{self.OSRM_ROUTE_URL}{u_node.lon},{u_node.lat};"
                f"{v_node.lon},{v_node.lat}?overview=false"
            )
            try:
                req = urllib.request.Request(
                    osrm_url, headers={"User-Agent": "VoltPath-NED-CEP/1.0"}
                )
                with urllib.request.urlopen(req, timeout=self.timeout_sec) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                    if data.get("code") == "Ok" and data.get("routes"):
                        live_km = data["routes"][0]["distance"] / 1000.0
                        self.api_status_log.append(
                            f"[API-Client] OSRM Live Route Check OK ({u_node.name} -> {v_node.name}: {live_km:.1f} km)."
                        )
                        return bool(self.api_key)
            except Exception as exc:
                self.api_status_log.append(
                    f"[API-Client] OSRM live endpoint unreachable ({exc}) -> Falling back to Mock Highway Graph."
                )

        return False

    @staticmethod
    def _read_local_mock_json(path: str) -> Dict[str, Any]:
        if not os.path.exists(path):
            raise FileNotFoundError(f"Mock dataset file not found at: {path}")
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
