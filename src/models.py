"""
Domain Data Models for VoltPath EV Trip Charging Planner.
"""
from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass
class ChargingStation:
    station_id: str
    name: str
    power_kw: float
    cost_per_kwh: float
    is_available: bool = True
    queue_wait_hours: float = 0.10


@dataclass
class Node:
    node_id: str
    name: str
    lat: float
    lon: float
    station: Optional[ChargingStation] = None


@dataclass
class RoadEdge:
    u: str
    v: str
    distance_km: float
    speed_kmh: float
    is_blocked: bool = False
    road_name: str = "Highway"

    @property
    def travel_time_hours(self) -> float:
        return self.distance_km / max(self.speed_kmh, 1.0)


@dataclass
class EVProfile:
    model_name: str
    battery_capacity_kwh: int       # B_max (integer kWh for DP state space)
    initial_soc_kwh: int            # B_0
    min_reserve_kwh: int            # B_min (Safety arrival reserve)
    consumption_kwh_per_km: float   # Energy burn rate (kWh/km)
    max_charge_acceptance_kw: float # Vehicle's internal charger ceiling (kW)

    @property
    def max_usable_energy_kwh(self) -> int:
        return self.battery_capacity_kwh - self.min_reserve_kwh


@dataclass
class CorridorSegment:
    from_node: Node
    to_node: Node
    distance_km: float
    drive_time_hours: float
    energy_required_kwh: int
    road_name: str


@dataclass
class ChargingStopDecision:
    node_id: str
    city_name: str
    station_name: str
    arrival_soc_kwh: int
    departure_soc_kwh: int
    charged_kwh: int
    charge_time_hours: float
    charge_cost_pkr: float
    effective_power_kw: float
    tariff_pkr_per_kwh: float


@dataclass
class TripPlan:
    status: str  # "OPTIMAL", "FEASIBLE_TIME_WARNING", "INFEASIBLE_DISCONNECTED", "INFEASIBLE_DEADZONE"
    data_source: str
    origin_name: str
    destination_name: str
    route_node_ids: List[str] = field(default_factory=list)
    route_node_names: List[str] = field(default_factory=list)
    total_distance_km: float = 0.0
    driving_time_hours: float = 0.0
    charging_time_hours: float = 0.0
    total_trip_time_hours: float = 0.0
    max_allowed_time_hours: float = 0.0
    total_charging_cost_pkr: float = 0.0
    total_energy_charged_kwh: int = 0
    final_arrival_soc_kwh: int = 0
    charging_stops: List[ChargingStopDecision] = field(default_factory=list)
    isolated_nodes: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    astar_metrics: Dict[str, float] = field(default_factory=dict)
    dp_metrics: Dict[str, object] = field(default_factory=dict)
