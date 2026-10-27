/**
 * Automatic Client-Side Fallback Dataset & Solver
 * Used automatically if the FastAPI backend (http://127.0.0.1:8000) is offline
 * or when deployed as a static frontend on Vercel/Netlify.
 */

export const MOCK_NETWORK = {
  data_source: "MOCK_DATASET (highway_network.json)",
  default_ev: {
    model_name: "BYD Atto 3 / MG ZS EV Long Range",
    battery_capacity_kwh: 75,
    initial_soc_kwh: 65,
    min_reserve_kwh: 12,
    consumption_kwh_per_km: 0.18,
    max_charge_acceptance_kw: 120
  },
  nodes: [
    { node_id: "N01", name: "Karachi (Start Hub)", lat: 24.8607, lon: 67.0011, station: { station_id: "CS-KHI", name: "K-Electric SuperHub Karachi", power_kw: 120, cost_per_kwh: 55.0, is_available: true, queue_wait_hours: 0.10 } },
    { node_id: "N02", name: "Hyderabad (M-9 Interchange)", lat: 25.3960, lon: 68.3578, station: { station_id: "CS-HYD", name: "PSO ElectroCharge Hyderabad", power_kw: 60, cost_per_kwh: 48.0, is_available: true, queue_wait_hours: 0.15 } },
    { node_id: "N03", name: "Nawabshah (N-5 Corridor)", lat: 26.2442, lon: 68.4100, station: { station_id: "CS-NWB", name: "Nawabshah AC Fast Point", power_kw: 40, cost_per_kwh: 42.0, is_available: true, queue_wait_hours: 0.10 } },
    { node_id: "N04", name: "Dadu (Indus Highway N-55)", lat: 26.7319, lon: 67.7750, station: { station_id: "CS-DAD", name: "Indus Rest-Stop Charger", power_kw: 30, cost_per_kwh: 40.0, is_available: false, queue_wait_hours: 0.25 } },
    { node_id: "N05", name: "Moro (Highway Service Area)", lat: 26.6652, lon: 68.0016, station: { station_id: "CS-MOR", name: "Moro Highway DC Hub", power_kw: 90, cost_per_kwh: 52.0, is_available: true, queue_wait_hours: 0.10 } },
    { node_id: "N06", name: "Sukkur (M-5 Southern Terminal)", lat: 27.7052, lon: 68.8574, station: { station_id: "CS-SUK", name: "Sukkur Barrage UltraCharge", power_kw: 120, cost_per_kwh: 62.0, is_available: true, queue_wait_hours: 0.10 } },
    { node_id: "N07", name: "Rahim Yar Khan (M-5 Service Stop)", lat: 28.4202, lon: 70.2952, station: { station_id: "CS-RYK", name: "RYK Motorway Oasis DC", power_kw: 100, cost_per_kwh: 58.0, is_available: true, queue_wait_hours: 0.15 } },
    { node_id: "N08", name: "Bahawalpur (Sutlej Hub)", lat: 29.3956, lon: 71.6836, station: { station_id: "CS-BWP", name: "Bahawalpur EcoCharge", power_kw: 75, cost_per_kwh: 46.0, is_available: true, queue_wait_hours: 0.10 } },
    { node_id: "N09", name: "Multan (M-4 / M-5 Junction)", lat: 30.1575, lon: 71.5249, station: { station_id: "CS-MUX", name: "Multan SuperGrid 150kW", power_kw: 150, cost_per_kwh: 68.0, is_available: true, queue_wait_hours: 0.08 } },
    { node_id: "N10", name: "Sahiwal (GT Road N-5)", lat: 30.6682, lon: 73.1114, station: { station_id: "CS-SWL", name: "Sahiwal GreenVolt Station", power_kw: 60, cost_per_kwh: 44.0, is_available: true, queue_wait_hours: 0.15 } },
    { node_id: "N11", name: "Faisalabad (M-3 / M-4 Hub)", lat: 31.4504, lon: 73.1350, station: { station_id: "CS-FSD", name: "Faisalabad M-4 RapidCharge", power_kw: 110, cost_per_kwh: 54.0, is_available: true, queue_wait_hours: 0.10 } },
    { node_id: "N12", name: "Lahore (M-2 / M-3 Ravi Hub)", lat: 31.5204, lon: 74.3587, station: { station_id: "CS-LHE", name: "Lahore Expo HyperCharge", power_kw: 150, cost_per_kwh: 65.0, is_available: true, queue_wait_hours: 0.10 } },
    { node_id: "N13", name: "Bhera / Chakwal (M-2 Salt Range)", lat: 32.4826, lon: 72.9086, station: { station_id: "CS-BHR", name: "Bhera Service Area M-2 Charger", power_kw: 120, cost_per_kwh: 60.0, is_available: true, queue_wait_hours: 0.10 } },
    { node_id: "N14", name: "Islamabad (Zero Point Destination)", lat: 33.6844, lon: 73.0479, station: { station_id: "CS-ISB", name: "Islamabad BlueArea EV Plaza", power_kw: 120, cost_per_kwh: 55.0, is_available: true, queue_wait_hours: 0.05 } }
  ],
  edges: [
    { u: "N01", v: "N02", distance_km: 160, speed_kmh: 100, is_blocked: false, road_name: "M-9 Motorway" },
    { u: "N01", v: "N04", distance_km: 290, speed_kmh: 80, is_blocked: true, road_name: "N-55 Lower Indus (Submerged/Closed)" },
    { u: "N02", v: "N03", distance_km: 125, speed_kmh: 95, is_blocked: false, road_name: "N-5 Highway South" },
    { u: "N02", v: "N04", distance_km: 175, speed_kmh: 85, is_blocked: false, road_name: "Indus Link Road" },
    { u: "N02", v: "N05", distance_km: 195, speed_kmh: 95, is_blocked: false, road_name: "N-5 Direct Express" },
    { u: "N03", v: "N05", distance_km: 85, speed_kmh: 90, is_blocked: false, road_name: "N-5 Moro Link" },
    { u: "N03", v: "N06", distance_km: 210, speed_kmh: 95, is_blocked: false, road_name: "N-5 Rohri Corridor" },
    { u: "N04", v: "N05", distance_km: 45, speed_kmh: 80, is_blocked: false, road_name: "Dadu-Moro Bridge" },
    { u: "N04", v: "N06", distance_km: 190, speed_kmh: 85, is_blocked: false, road_name: "N-55 Larkana Link" },
    { u: "N05", v: "N06", distance_km: 150, speed_kmh: 100, is_blocked: false, road_name: "N-5 Sukkur Express" },
    { u: "N06", v: "N07", distance_km: 195, speed_kmh: 110, is_blocked: false, road_name: "M-5 Motorway South" },
    { u: "N07", v: "N08", distance_km: 185, speed_kmh: 110, is_blocked: false, road_name: "M-5 Uch Sharif Section" },
    { u: "N07", v: "N09", distance_km: 265, speed_kmh: 115, is_blocked: false, road_name: "M-5 Direct Multan" },
    { u: "N08", v: "N09", distance_km: 95, speed_kmh: 105, is_blocked: false, road_name: "N-5 Lodhran Express" },
    { u: "N08", v: "N10", distance_km: 215, speed_kmh: 95, is_blocked: false, road_name: "Sutlej Valley Highway" },
    { u: "N09", v: "N10", distance_km: 175, speed_kmh: 100, is_blocked: false, road_name: "N-5 Khanewal-Sahiwal" },
    { u: "N09", v: "N11", distance_km: 240, speed_kmh: 115, is_blocked: false, road_name: "M-4 Motorway" },
    { u: "N10", v: "N11", distance_km: 95, speed_kmh: 95, is_blocked: false, road_name: "Sahiwal-Faisalabad Link" },
    { u: "N10", v: "N12", distance_km: 170, speed_kmh: 100, is_blocked: false, road_name: "N-5 Okara-Lahore" },
    { u: "N11", v: "N12", distance_km: 145, speed_kmh: 115, is_blocked: false, road_name: "M-3 Abdul Hakim Motorway" },
    { u: "N11", v: "N13", distance_km: 155, speed_kmh: 115, is_blocked: false, road_name: "M-4 / M-2 Pindi Bhattian" },
    { u: "N12", v: "N13", distance_km: 180, speed_kmh: 115, is_blocked: false, road_name: "M-2 Lahore-Bhera" },
    { u: "N13", v: "N14", distance_km: 165, speed_kmh: 110, is_blocked: false, road_name: "M-2 Salt Range-Islamabad" },
    { u: "N12", v: "N14", distance_km: 355, speed_kmh: 95, is_blocked: true, road_name: "GT Road N-5 Direct (Blocked for Construction)" }
  ]
};

export const MOCK_DEFAULT_PLAN = {
  status: "OPTIMAL",
  data_source: "MOCK_DATASET (highway_network.json)",
  origin_name: "Karachi (Start Hub)",
  destination_name: "Islamabad (Zero Point Destination)",
  route_node_ids: ["N01", "N02", "N03", "N06", "N07", "N08", "N10", "N11", "N13", "N14"],
  route_node_names: [
    "Karachi (Start Hub)",
    "Hyderabad (M-9 Interchange)",
    "Nawabshah (N-5 Corridor)",
    "Sukkur (M-5 Southern Terminal)",
    "Rahim Yar Khan (M-5 Service Stop)",
    "Bahawalpur (Sutlej Hub)",
    "Sahiwal (GT Road N-5)",
    "Faisalabad (M-3 / M-4 Hub)",
    "Bhera / Chakwal (M-2 Salt Range)",
    "Islamabad (Zero Point Destination)"
  ],
  total_distance_km: 1505.0,
  driving_time_hours: 14.69,
  charging_time_hours: 3.81,
  total_trip_time_hours: 18.50,
  max_allowed_time_hours: 18.50,
  total_charging_cost_pkr: 11012.0,
  total_energy_charged_kwh: 222,
  final_arrival_soc_kwh: 12,
  charging_stops: [
    { node_id: "N03", city_name: "Nawabshah (N-5 Corridor)", station_name: "Nawabshah AC Fast Point", arrival_soc_kwh: 13, departure_soc_kwh: 73, charged_kwh: 60, charge_time_hours: 1.60, charge_cost_pkr: 2520.0, effective_power_kw: 40, tariff_pkr_per_kwh: 42.0 },
    { node_id: "N06", city_name: "Sukkur (M-5 Southern Terminal)", station_name: "Sukkur Barrage UltraCharge", arrival_soc_kwh: 35, departure_soc_kwh: 48, charged_kwh: 13, charge_time_hours: 0.208, charge_cost_pkr: 806.0, effective_power_kw: 120, tariff_pkr_per_kwh: 62.0 },
    { node_id: "N07", city_name: "Rahim Yar Khan (M-5 Service Stop)", station_name: "RYK Motorway Oasis DC", arrival_soc_kwh: 12, departure_soc_kwh: 46, charged_kwh: 34, charge_time_hours: 0.49, charge_cost_pkr: 1972.0, effective_power_kw: 100, tariff_pkr_per_kwh: 58.0 },
    { node_id: "N08", city_name: "Bahawalpur (Sutlej Hub)", station_name: "Bahawalpur EcoCharge", arrival_soc_kwh: 12, departure_soc_kwh: 74, charged_kwh: 62, charge_time_hours: 0.927, charge_cost_pkr: 2852.0, effective_power_kw: 75, tariff_pkr_per_kwh: 46.0 },
    { node_id: "N11", city_name: "Faisalabad (M-3 / M-4 Hub)", station_name: "Faisalabad M-4 RapidCharge", arrival_soc_kwh: 17, departure_soc_kwh: 70, charged_kwh: 53, charge_time_hours: 0.582, charge_cost_pkr: 2862.0, effective_power_kw: 110, tariff_pkr_per_kwh: 54.0 }
  ],
  isolated_nodes: [],
  warnings: [
    "Station 'Indus Rest-Stop Charger' at Dadu (Indus Highway N-55) is OFFLINE -> Excluded from DP charging stops.",
    "Station 'Multan SuperGrid 150kW' (150 kW) clamped to EV max acceptance (120 kW).",
    "Station 'Lahore Expo HyperCharge' (150 kW) clamped to EV max acceptance (120 kW)."
  ],
  astar_metrics: {
    nodes_expanded: 13,
    edges_examined: 40,
    tie_breaks_triggered: 0,
    total_distance_km: 1505.0,
    total_drive_time_hours: 14.692,
    heuristic_origin_km: 1142.48
  },
  dp_metrics: {
    corridor_stations_k: 10,
    battery_states_B: 64,
    dp_states_evaluated: 58920,
    brute_force_combinations: "64^9"
  }
};

export const MOCK_INCREMENTAL = {
  initial_route_ids: ["N01", "N02", "N03", "N06", "N07", "N08", "N10", "N11", "N13", "N14"],
  initial_route_names: ["Karachi (Start Hub)", "Hyderabad (M-9 Interchange)", "Nawabshah (N-5 Corridor)", "Sukkur (M-5 Southern Terminal)", "Rahim Yar Khan (M-5 Service Stop)", "Bahawalpur (Sutlej Hub)", "Sahiwal (GT Road N-5)", "Faisalabad (M-3 / M-4 Hub)", "Bhera / Chakwal (M-2 Salt Range)", "Islamabad (Zero Point Destination)"],
  initial_distance_km: 1505.0,
  newly_blocked_edges: [["N08", "N10"], ["N03", "N06"], ["N07", "N09"]],
  recomputed: true,
  reason: "Affected downstream branch repaired via local A*.",
  divergence_node_id: "N03",
  divergence_node_name: "Nawabshah (N-5 Corridor)",
  updated_route_ids: ["N01", "N02", "N03", "N05", "N06", "N07", "N08", "N09", "N10", "N11", "N13", "N14"],
  updated_route_names: ["Karachi (Start Hub)", "Hyderabad (M-9 Interchange)", "Nawabshah (N-5 Corridor)", "Moro (Highway Service Area)", "Sukkur (M-5 Southern Terminal)", "Rahim Yar Khan (M-5 Service Stop)", "Bahawalpur (Sutlej Hub)", "Multan (M-4 / M-5 Junction)", "Sahiwal (GT Road N-5)", "Faisalabad (M-3 / M-4 Hub)", "Bhera / Chakwal (M-2 Salt Range)", "Islamabad (Zero Point Destination)"],
  updated_distance_km: 1585.0,
  incremental_nodes_expanded: 11,
  full_scratch_nodes_expanded: 13,
  nodes_saved_pct: 15.4
};

export const MOCK_EDGE_CASES = [
  {
    id: "EC1",
    title: "Edge Case 1: Disconnected Graph / Isolated Cities",
    cep_ref: "Part A.2 & WP5",
    description: "Karakoram Highway (N02 -> N03) is blocked by a landslide, isolating Gilgit and Skardu from Islamabad.",
    result: {
      status: "INFEASIBLE_DISCONNECTED",
      origin_name: "Islamabad",
      destination_name: "Skardu (Isolated)",
      isolated_nodes: ["Gilgit (Isolated) (N03)", "Skardu (Isolated) (N04)"],
      warnings: ["DISCONNECTED GRAPH: Destination 'Skardu (Isolated)' cannot be reached from 'Islamabad'. Isolated nodes detected: Gilgit (Isolated) (N03), Skardu (Isolated) (N04)"]
    }
  },
  {
    id: "EC2",
    title: "Edge Case 2: Range Dead-Zone & Offline/Incompatible Chargers",
    cep_ref: "Part B.4 & WP5",
    description: "Intermediate stations at Kalat & Khuzdar are offline (is_available=false), creating a 300 km (60 kWh) gap that exceeds usable battery capacity (40 kWh).",
    result: {
      status: "INFEASIBLE_DEADZONE",
      origin_name: "Quetta",
      destination_name: "Gwadar",
      total_distance_km: 620.0,
      warnings: [
        "Station 'Kalat Point' at Kalat (Charger Offline) is OFFLINE -> Excluded from DP charging stops.",
        "Station 'Khuzdar Point' at Khuzdar (Charger Offline) is OFFLINE -> Excluded from DP charging stops.",
        "Station 'Gwadar Port Hub' (100 kW) clamped to EV max acceptance (80 kW).",
        "RANGE DEAD-ZONE DETECTED between 'Quetta' and 'Khuzdar (Charger Offline)': Requires 60 kWh (300 km), which exceeds maximum usable battery capacity 40 kWh (B_max=50 kWh, B_min=10 kWh)."
      ]
    }
  },
  {
    id: "EC3",
    title: "Edge Case 3: Over-Constrained Time Budget (T_trip > T_max)",
    cep_ref: "Part B.3 & WP5",
    description: "User requests Karachi -> Islamabad under T_max = 11.0 hrs, which is physically impossible even with ultra-fast charging. DP returns the minimum-time feasible fallback plan (17.69 hrs) with diagnostic.",
    result: {
      status: "FEASIBLE_TIME_WARNING",
      origin_name: "Karachi (Start Hub)",
      destination_name: "Islamabad (Zero Point Destination)",
      total_distance_km: 1505.0,
      total_trip_time_hours: 17.694,
      max_allowed_time_hours: 11.0,
      total_charging_cost_pkr: 12190.0,
      warnings: ["OVER-CONSTRAINED TIME BUDGET: Requested T_max = 11.00 hrs, but minimum physically achievable trip time is 17.69 hrs (exceeds budget by 6.69 hrs). Returning minimum-time feasible charging plan."]
    }
  }
];

export const MOCK_SENSITIVITY = {
  removed_hubs: ["Hyderabad (M-9 Interchange) (N02)", "Bahawalpur (Sutlej Hub) (N08)"],
  baseline_route: ["Karachi (Start Hub)", "Hyderabad (M-9 Interchange)", "Nawabshah (N-5 Corridor)", "Sukkur (M-5 Southern Terminal)", "Rahim Yar Khan (M-5 Service Stop)", "Bahawalpur (Sutlej Hub)", "Sahiwal (GT Road N-5)", "Faisalabad (M-3 / M-4 Hub)", "Bhera / Chakwal (M-2 Salt Range)", "Islamabad (Zero Point Destination)"],
  perturbed_route: ["Karachi (Start Hub)", "Hyderabad (M-9 Interchange)", "Nawabshah (N-5 Corridor)", "Sukkur (M-5 Southern Terminal)", "Rahim Yar Khan (M-5 Service Stop)", "Bahawalpur (Sutlej Hub)", "Multan (M-4 / M-5 Junction)", "Sahiwal (GT Road N-5)", "Faisalabad (M-3 / M-4 Hub)", "Bhera / Chakwal (M-2 Salt Range)", "Islamabad (Zero Point Destination)"],
  baseline_distance_km: 1505.0,
  perturbed_distance_km: 1565.0,
  baseline_cost_pkr: 11012.0,
  perturbed_cost_pkr: 12044.0,
  baseline_time_hours: 18.474,
  perturbed_time_hours: 18.198,
  baseline_stops: [
    "Nawabshah (N-5 Corridor) (+60 kWh @ PKR 42.0/kWh)",
    "Sukkur (M-5 Southern Terminal) (+13 kWh @ PKR 62.0/kWh)",
    "Rahim Yar Khan (M-5 Service Stop) (+34 kWh @ PKR 58.0/kWh)",
    "Bahawalpur (Sutlej Hub) (+62 kWh @ PKR 46.0/kWh)",
    "Faisalabad (M-3 / M-4 Hub) (+53 kWh @ PKR 54.0/kWh)"
  ],
  perturbed_stops: [
    "Karachi (Start Hub) (+10 kWh @ PKR 55.0/kWh)",
    "Nawabshah (N-5 Corridor) (+58 kWh @ PKR 42.0/kWh)",
    "Sukkur (M-5 Southern Terminal) (+7 kWh @ PKR 62.0/kWh)",
    "Rahim Yar Khan (M-5 Service Stop) (+61 kWh @ PKR 58.0/kWh)",
    "Multan (M-4 / M-5 Junction) (+43 kWh @ PKR 68.0/kWh)",
    "Faisalabad (M-3 / M-4 Hub) (+54 kWh @ PKR 54.0/kWh)"
  ]
};
