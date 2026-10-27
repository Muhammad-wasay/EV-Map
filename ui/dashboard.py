"""
Generates a 100% Free Interactive OpenStreetMap + Leaflet.js HTML Dashboard
visualizing the highway network, chosen A* route, and DP charging stops.
"""
import json
import os
from typing import Dict, List

from src.models import Node, RoadEdge, TripPlan


def generate_interactive_map_html(
    nodes: Dict[str, Node],
    edges: List[RoadEdge],
    plan: TripPlan,
    output_path: str = "ui/voltpath_map.html",
) -> str:
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    nodes_js = []
    stop_lookup = {s.node_id: s for s in plan.charging_stops}
    for nid, n in nodes.items():
        st = n.station
        stop_info = stop_lookup.get(nid)
        nodes_js.append(
            {
                "id": nid,
                "name": n.name,
                "lat": n.lat,
                "lon": n.lon,
                "has_station": st is not None,
                "is_available": st.is_available if st else False,
                "power_kw": st.power_kw if st else 0,
                "cost_pkr": st.cost_per_kwh if st else 0,
                "is_route_node": nid in plan.route_node_ids,
                "is_charging_stop": stop_info is not None,
                "charged_kwh": stop_info.charged_kwh if stop_info else 0,
                "charge_cost": stop_info.charge_cost_pkr if stop_info else 0,
            }
        )

    edges_js = [
        {
            "lat1": nodes[e.u].lat,
            "lon1": nodes[e.u].lon,
            "lat2": nodes[e.v].lat,
            "lon2": nodes[e.v].lon,
            "road_name": e.road_name,
            "dist": e.distance_km,
            "blocked": e.is_blocked,
        }
        for e in edges
    ]

    route_coords = [
        [nodes[nid].lat, nodes[nid].lon] for nid in plan.route_node_ids if nid in nodes
    ]

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>VoltPath — EV Trip Charging Planner (NED CT-363 CEP)</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body {{ margin: 0; font-family: 'Segoe UI', system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; height: 100vh; }}
    #sidebar {{ width: 400px; padding: 20px; overflow-y: auto; background: #1e293b; border-right: 1px solid #334155; }}
    #map {{ flex: 1; height: 100vh; }}
    h1 {{ font-size: 1.3rem; margin-top: 0; color: #38bdf8; }}
    .card {{ background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 12px; margin-bottom: 12px; }}
    .badge {{ display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 0.78rem; font-weight: 600; background: #0284c7; }}
    .stop-item {{ border-left: 3px solid #22c55e; padding-left: 10px; margin: 8px 0; font-size: 0.9rem; }}
    .meta {{ color: #94a3b8; font-size: 0.82rem; }}
  </style>
</head>
<body>
  <div id="sidebar">
    <h1>⚡ VoltPath EV Planner</h1>
    <div class="meta">NED University CT-363 DAA CEP | A* + Dynamic Programming</div>
    <hr style="border-color:#334155; margin:12px 0;" />
    <div class="card">
      <div><span class="badge">{plan.status}</span> <span class="meta">{plan.data_source}</span></div>
      <p><strong>Route:</strong> {plan.origin_name} &rarr; {plan.destination_name}</p>
      <p><strong>Total Distance:</strong> {plan.total_distance_km:.1f} km</p>
      <p><strong>Total Time:</strong> {plan.total_trip_time_hours:.2f} hrs (Drive: {plan.driving_time_hours:.2f}h, Charge: {plan.charging_time_hours:.2f}h)</p>
      <p><strong>Total Charging Cost:</strong> PKR {plan.total_charging_cost_pkr:,.2f}</p>
      <p><strong>Total Energy Charged:</strong> {plan.total_energy_charged_kwh} kWh | <strong>Final Arrival SoC:</strong> {plan.final_arrival_soc_kwh} kWh</p>
    </div>
    <h3>🔋 Selected DP Charging Stops ({len(plan.charging_stops)})</h3>
    {"".join(f'<div class="card stop-item"><strong>{s.city_name}</strong> ({s.station_name})<br/>SoC: {s.arrival_soc_kwh} &rarr; {s.departure_soc_kwh} kWh (+{s.charged_kwh} kWh)<br/>Time: {s.charge_time_hours*60:.0f} mins @ {s.effective_power_kw:.0f} kW | Cost: PKR {s.charge_cost_pkr:,.0f}</div>' for s in plan.charging_stops)}
  </div>
  <div id="map"></div>
  <script>
    const map = L.map('map').setView([29.5, 70.5], 6);
    L.tileLayer('https://{{s}}.tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png', {{
      attribution: '&copy; OpenStreetMap contributors (100% Free)'
    }}).addTo(map);

    const edges = {json.dumps(edges_js)};
    edges.forEach(e => {{
      L.polyline([[e.lat1, e.lon1], [e.lat2, e.lon2]], {{
        color: e.blocked ? '#ef4444' : '#64748b',
        weight: e.blocked ? 2 : 3,
        dashArray: e.blocked ? '6, 6' : null,
        opacity: 0.65
      }}).bindPopup(e.road_name + ' (' + e.dist + ' km)' + (e.blocked ? ' [BLOCKED]' : '')).addTo(map);
    }});

    const routeCoords = {json.dumps(route_coords)};
    if (routeCoords.length > 1) {{
      L.polyline(routeCoords, {{ color: '#38bdf8', weight: 6, opacity: 0.9 }}).addTo(map);
    }}

    const nodes = {json.dumps(nodes_js)};
    nodes.forEach(n => {{
      let color = '#94a3b8';
      let radius = 6;
      if (!n.is_available) color = '#ef4444';
      else if (n.is_charging_stop) {{ color = '#22c55e'; radius = 10; }}
      else if (n.is_route_node) {{ color = '#38bdf8'; radius = 8; }}

      L.circleMarker([n.lat, n.lon], {{
        radius: radius,
        fillColor: color,
        color: '#0f172a',
        weight: 2,
        fillOpacity: 0.95
      }}).bindPopup(
        '<b>' + n.name + ' (' + n.id + ')</b><br/>' +
        'Charger: ' + n.power_kw + ' kW @ PKR ' + n.cost_pkr + '/kWh<br/>' +
        'Status: ' + (n.is_available ? 'Available' : 'OFFLINE') +
        (n.is_charging_stop ? '<br/><b style="color:#16a34a">DP STOP: +' + n.charged_kwh + ' kWh (PKR ' + n.charge_cost + ')</b>' : '')
      ).addTo(map);
    }});
  </script>
</body>
</html>
"""
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    return output_path
