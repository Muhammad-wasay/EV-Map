import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import {
  MOCK_DEFAULT_PLAN,
  MOCK_EDGE_CASES,
  MOCK_INCREMENTAL,
  MOCK_NETWORK,
  MOCK_SENSITIVITY
} from './mockFallback.js'

const API_BASE = 'http://127.0.0.1:8000'

export default function App() {
  const [activeTab, setActiveTab] = useState('planner')
  const [backendStatus, setBackendStatus] = useState('CHECKING')
  const [network, setNetwork] = useState(MOCK_NETWORK)
  const [plan, setPlan] = useState(MOCK_DEFAULT_PLAN)
  const [incResult, setIncResult] = useState(MOCK_INCREMENTAL)
  const [edgeCases, setEdgeCases] = useState(MOCK_EDGE_CASES)
  const [sensitivity, setSensitivity] = useState(MOCK_SENSITIVITY)
  const [loading, setLoading] = useState(false)

  // Form Controls
  const [originId, setOriginId] = useState('N01')
  const [destId, setDestId] = useState('N14')
  const [batteryCap, setBatteryCap] = useState(75)
  const [initialSoc, setInitialSoc] = useState(65)
  const [minReserve, setMinReserve] = useState(12)
  const [maxTime, setMaxTime] = useState(18.5)
  const [useLiveApi, setUseLiveApi] = useState(false)

  // Incremental Closure Controls
  const [selectedClosures, setSelectedClosures] = useState([
    'N08-N10',
    'N03-N06',
    'N07-N09'
  ])

  const mapContainerRef = useRef(null)
  const leafletMapRef = useRef(null)
  const layerGroupRef = useRef(null)

  // Initial Load from FastAPI Backend (with automatic Fallback to Mock)
  useEffect(() => {
    async function bootstrap() {
      try {
        const healthResp = await fetch(`${API_BASE}/api/health`)
        if (!healthResp.ok) throw new Error('FastAPI non-200')
        setBackendStatus('FASTAPI_ONLINE')

        const [netR, planR, incR, ecR, sensR] = await Promise.all([
          fetch(`${API_BASE}/api/network`),
          fetch(`${API_BASE}/api/plan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              origin_id: 'N01',
              dest_id: 'N14',
              max_allowed_time_hours: 18.5,
              battery_capacity_kwh: 75,
              initial_soc_kwh: 65,
              min_reserve_kwh: 12,
              consumption_kwh_per_km: 0.18,
              max_charge_acceptance_kw: 120,
              use_live_api: false
            })
          }),
          fetch(`${API_BASE}/api/incremental-update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              origin_id: 'N01',
              dest_id: 'N14',
              newly_blocked_edges: [
                ['N08', 'N10'],
                ['N03', 'N06'],
                ['N07', 'N09']
              ]
            })
          }),
          fetch(`${API_BASE}/api/edge-cases`),
          fetch(`${API_BASE}/api/sensitivity`)
        ])

        if (netR.ok) setNetwork(await netR.json())
        if (planR.ok) {
          const pData = await planR.json()
          setPlan(pData.plan)
        }
        if (incR.ok) setIncResult(await incR.json())
        if (ecR.ok) {
          const ecData = await ecR.json()
          setEdgeCases(ecData.edge_cases)
        }
        if (sensR.ok) setSensitivity(await sensR.json())
      } catch (err) {
        setBackendStatus('MOCK_FALLBACK')
      }
    }
    bootstrap()
  }, [])

  // Render & Update Leaflet Map
  useEffect(() => {
    if (activeTab !== 'planner' || !mapContainerRef.current) return

    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapContainerRef.current).setView([29.3, 70.5], 5)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors (100% Free)'
      }).addTo(leafletMapRef.current)
      layerGroupRef.current = L.layerGroup().addTo(leafletMapRef.current)
    }

    const lg = layerGroupRef.current
    lg.clearLayers()

    const nodeMap = {}
    network.nodes.forEach((n) => {
      nodeMap[n.node_id] = n
    })

    // Draw all highway edges
    network.edges.forEach((e) => {
      const u = nodeMap[e.u]
      const v = nodeMap[e.v]
      if (!u || !v) return
      L.polyline(
        [
          [u.lat, u.lon],
          [v.lat, v.lon]
        ],
        {
          color: e.is_blocked ? '#ef4444' : '#475569',
          weight: e.is_blocked ? 2.5 : 3,
          dashArray: e.is_blocked ? '6, 6' : null,
          opacity: 0.7
        }
      )
        .bindPopup(
          `<b>${e.road_name}</b><br/>Distance: ${e.distance_km} km | Speed: ${e.speed_kmh} km/h<br/>Status: ${
            e.is_blocked ? '<span style="color:#ef4444">BLOCKED</span>' : 'Open'
          }`
        )
        .addTo(lg)
    })

    // Highlight active A* route
    if (plan.route_node_ids && plan.route_node_ids.length > 1) {
      const routeLatLngs = plan.route_node_ids
        .map((id) => nodeMap[id])
        .filter(Boolean)
        .map((n) => [n.lat, n.lon])
      L.polyline(routeLatLngs, {
        color: '#38bdf8',
        weight: 6,
        opacity: 0.92
      }).addTo(lg)
    }

    // Draw city nodes & charging stop markers
    const stopSet = {}
    ;(plan.charging_stops || []).forEach((s) => {
      stopSet[s.node_id] = s
    })

    network.nodes.forEach((n) => {
      const st = n.station
      const stopInfo = stopSet[n.node_id]
      const isRoute = (plan.route_node_ids || []).includes(n.node_id)

      let fillColor = '#64748b'
      let radius = 6
      if (st && !st.is_available) {
        fillColor = '#ef4444'
      } else if (stopInfo) {
        fillColor = '#22c55e'
        radius = 10
      } else if (isRoute) {
        fillColor = '#38bdf8'
        radius = 8
      }

      L.circleMarker([n.lat, n.lon], {
        radius,
        fillColor,
        color: '#0f172a',
        weight: 2,
        fillOpacity: 0.95
      })
        .bindPopup(
          `<b>${n.name} (${n.node_id})</b><br/>` +
            (st
              ? `Station: ${st.name}<br/>Power: ${st.power_kw} kW | Tariff: PKR ${st.cost_per_kwh}/kWh<br/>Status: ${
                  st.is_available ? 'Available' : 'OFFLINE'
                }`
              : 'No station') +
            (stopInfo
              ? `<br/><b style="color:#16a34a">⚡ DP Charging Stop: +${stopInfo.charged_kwh} kWh (PKR ${stopInfo.charge_cost_pkr})</b>`
              : '')
        )
        .addTo(lg)
    })

    setTimeout(() => {
      leafletMapRef.current.invalidateSize()
    }, 100)
  }, [activeTab, network, plan])

  async function handleRunPlanner(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const resp = await fetch(`${API_BASE}/api/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin_id: originId,
          dest_id: destId,
          max_allowed_time_hours: Number(maxTime),
          battery_capacity_kwh: Number(batteryCap),
          initial_soc_kwh: Number(initialSoc),
          min_reserve_kwh: Number(minReserve),
          consumption_kwh_per_km: 0.18,
          max_charge_acceptance_kw: 120.0,
          use_live_api: useLiveApi
        })
      })
      if (!resp.ok) throw new Error('Backend unreachable')
      const data = await resp.json()
      setPlan(data.plan)
      setBackendStatus('FASTAPI_ONLINE')
    } catch (err) {
      setBackendStatus('MOCK_FALLBACK')
      if (Number(maxTime) < 17.69) {
        setPlan({
          ...MOCK_DEFAULT_PLAN,
          status: 'FEASIBLE_TIME_WARNING',
          max_allowed_time_hours: Number(maxTime),
          total_trip_time_hours: 17.69,
          total_charging_cost_pkr: 12190.0,
          warnings: [
            `OVER-CONSTRAINED TIME BUDGET: Requested T_max = ${Number(maxTime).toFixed(
              2
            )} hrs, but minimum physically achievable trip time is 17.69 hrs. Returning minimum-time feasible charging plan.`
          ]
        })
      } else {
        setPlan({
          ...MOCK_DEFAULT_PLAN,
          max_allowed_time_hours: Number(maxTime)
        })
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleRunIncremental() {
    const pairs = selectedClosures.map((s) => s.split('-'))
    try {
      const resp = await fetch(`${API_BASE}/api/incremental-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin_id: originId,
          dest_id: destId,
          newly_blocked_edges: pairs
        })
      })
      if (resp.ok) {
        setIncResult(await resp.json())
        setBackendStatus('FASTAPI_ONLINE')
      }
    } catch (err) {
      setBackendStatus('MOCK_FALLBACK')
    }
  }

  function toggleClosure(edgeKey) {
    setSelectedClosures((prev) =>
      prev.includes(edgeKey) ? prev.filter((k) => k !== edgeKey) : [...prev, edgeKey]
    )
  }

  const stopNodeIds = new Set((plan.charging_stops || []).map((s) => s.node_id))

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="top-header">
        <div className="brand-title">
          <div>
            <h1>⚡ VoltPath — EV Trip Charging Planner</h1>
            <div className="brand-subtitle">
              NED University CT-363 Design &amp; Analysis of Algorithms (CEP) | Dual-Paradigm: A* Search + Dynamic Programming
            </div>
          </div>
        </div>
        <div className="header-badges">
          <span className={`pill ${backendStatus === 'FASTAPI_ONLINE' ? 'online' : 'fallback'}`}>
            {backendStatus === 'FASTAPI_ONLINE'
              ? '🟢 FastAPI Backend Connected (:8000)'
              : '🟠 Client Mock Fallback Active'}
          </span>
          <span className="pill">Source: {plan.data_source}</span>
        </div>
      </header>

      <div className="main-workspace">
        {/* Left Control Sidebar */}
        <aside className="control-sidebar">
          <form onSubmit={handleRunPlanner}>
            <h2 className="section-heading">1. Route Endpoints (Part A)</h2>
            <div className="form-group">
              <label>Origin City</label>
              <select value={originId} onChange={(e) => setOriginId(e.target.value)}>
                {network.nodes.map((n) => (
                  <option key={n.node_id} value={n.node_id}>
                    {n.node_id} — {n.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Destination City</label>
              <select value={destId} onChange={(e) => setDestId(e.target.value)}>
                {network.nodes.map((n) => (
                  <option key={n.node_id} value={n.node_id}>
                    {n.node_id} — {n.name}
                  </option>
                ))}
              </select>
            </div>

            <h2 className="section-heading" style={{ marginTop: 16 }}>
              2. EV &amp; Constraint Specs (Part B)
            </h2>
            <div className="form-group">
              <label>
                <span>Battery Capacity (B_max)</span>
                <strong>{batteryCap} kWh</strong>
              </label>
              <input
                type="range"
                min="50"
                max="100"
                value={batteryCap}
                onChange={(e) => setBatteryCap(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>
                <span>Initial Battery Level (B_0)</span>
                <strong>{initialSoc} kWh</strong>
              </label>
              <input
                type="range"
                min="20"
                max={batteryCap}
                value={initialSoc}
                onChange={(e) => setInitialSoc(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>
                <span>Min Arrival Safety Reserve (B_min)</span>
                <strong>{minReserve} kWh</strong>
              </label>
              <input
                type="range"
                min="8"
                max="25"
                value={minReserve}
                onChange={(e) => setMinReserve(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>
                <span>Max Allowed Trip Time (T_max)</span>
                <strong>{maxTime} hrs</strong>
              </label>
              <input
                type="range"
                min="10.0"
                max="24.0"
                step="0.5"
                value={maxTime}
                onChange={(e) => setMaxTime(Number(e.target.value))}
              />
            </div>

            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                id="liveApiChk"
                checked={useLiveApi}
                onChange={(e) => setUseLiveApi(e.target.checked)}
              />
              <label htmlFor="liveApiChk" style={{ cursor: 'pointer', color: '#f8fafc' }}>
                Attempt Live API (Fallback to Mock)
              </label>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
              {loading ? 'Computing Optimal Plan...' : '⚡ Compute A* Route + DP Plan'}
            </button>
          </form>

          <div className="team-box">
            <div className="section-heading" style={{ marginBottom: 4 }}>
              👥 Team Members (CSIT)
            </div>
            <div>• Muhammad Wasay Rafiq (CT-24236)</div>
            <div>• Muhammad Sarim Umer (CT-24235)</div>
            <div>• Muhammad Usman Masood (CT-24239)</div>
            <div>• Muhammad Feras Malik (CT-24247)</div>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="content-area">
          <div className="nav-tabs">
            <button
              className={`tab-btn ${activeTab === 'planner' ? 'active' : ''}`}
              onClick={() => setActiveTab('planner')}
            >
              🗺️ Part A &amp; B: Route Map &amp; DP Schedule
            </button>
            <button
              className={`tab-btn ${activeTab === 'incremental' ? 'active' : ''}`}
              onClick={() => setActiveTab('incremental')}
            >
              🚧 Part A.6: Incremental Route Repair
            </button>
            <button
              className={`tab-btn ${activeTab === 'edgecases' ? 'active' : ''}`}
              onClick={() => setActiveTab('edgecases')}
            >
              ⚠️ WP5: 3 Mandatory Edge Cases
            </button>
            <button
              className={`tab-btn ${activeTab === 'sensitivity' ? 'active' : ''}`}
              onClick={() => setActiveTab('sensitivity')}
            >
              📊 Part C &amp; WP3: Sensitivity &amp; Complexity
            </button>
          </div>

          {/* TAB 1: PLANNER */}
          {activeTab === 'planner' && (
            <>
              {(plan.warnings || []).map((w, idx) => (
                <div
                  key={idx}
                  className={plan.status.startsWith('INFEASIBLE') ? 'error-banner' : 'warning-banner'}
                >
                  {w}
                </div>
              ))}

              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-label">Plan Status</div>
                  <div
                    className="kpi-value"
                    style={{
                      color:
                        plan.status === 'OPTIMAL'
                          ? '#4ade80'
                          : plan.status === 'FEASIBLE_TIME_WARNING'
                          ? '#fbbf24'
                          : '#f87171',
                      fontSize: '1.05rem'
                    }}
                  >
                    {plan.status}
                  </div>
                  <div className="kpi-sub">Final Arrival SoC: {plan.final_arrival_soc_kwh} kWh</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-label">A* Route Distance</div>
                  <div className="kpi-value">{plan.total_distance_km} km</div>
                  <div className="kpi-sub">
                    A* Expanded: {plan.astar_metrics?.nodes_expanded || 0} nodes
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-label">Total Trip Duration</div>
                  <div className="kpi-value">{plan.total_trip_time_hours} hrs</div>
                  <div className="kpi-sub">
                    Drive: {plan.driving_time_hours}h | Charge: {plan.charging_time_hours}h (Cap: {plan.max_allowed_time_hours}h)
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-label">Optimal DP Charging Cost</div>
                  <div className="kpi-value" style={{ color: '#38bdf8' }}>
                    PKR {Number(plan.total_charging_cost_pkr).toLocaleString()}
                  </div>
                  <div className="kpi-sub">
                    Total Energy Added: +{plan.total_energy_charged_kwh} kWh ({plan.charging_stops?.length || 0} stops)
                  </div>
                </div>
              </div>

              <div className="panel-card">
                <h3>🛣️ Optimal A* Highway Corridor Sequence (Green = Selected DP Charging Stop)</h3>
                <div className="route-chain">
                  {(plan.route_node_names || []).map((name, i) => {
                    const nid = plan.route_node_ids?.[i]
                    const isStop = stopNodeIds.has(nid)
                    return (
                      <React.Fragment key={i}>
                        <span className={`route-node-chip ${isStop ? 'stop' : ''}`}>
                          {isStop ? '⚡ ' : ''}
                          {name}
                        </span>
                        {i < plan.route_node_names.length - 1 && (
                          <span style={{ color: '#64748b' }}>&rarr;</span>
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>

              <div className="map-schedule-grid">
                <div className="panel-card">
                  <h3>🌍 Interactive OpenStreetMap Visualization (100% Free / Zero API Key)</h3>
                  <div ref={mapContainerRef} className="leaflet-map-box" />
                </div>

                <div className="panel-card">
                  <h3>🔋 Backtracked DP Charging Schedule (Parent[i][b] Reconstruction)</h3>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>City &amp; Station</th>
                        <th>SoC (Arr &rarr; Dep)</th>
                        <th>Added</th>
                        <th>Power / Time</th>
                        <th>Cost (PKR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(plan.charging_stops || []).map((s, idx) => (
                        <tr key={idx}>
                          <td>
                            <strong>{s.city_name}</strong>
                            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                              {s.station_name}
                            </div>
                          </td>
                          <td>
                            {s.arrival_soc_kwh} &rarr; <strong>{s.departure_soc_kwh} kWh</strong>
                          </td>
                          <td style={{ color: '#4ade80', fontWeight: 600 }}>+{s.charged_kwh} kWh</td>
                          <td>
                            {s.effective_power_kw} kW ({Math.round(s.charge_time_hours * 60)}m)
                          </td>
                          <td>
                            <strong>PKR {Number(s.charge_cost_pkr).toLocaleString()}</strong>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                              @ {s.tariff_pkr_per_kwh}/kWh
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: INCREMENTAL UPDATE (PART A.6) */}
          {activeTab === 'incremental' && (
            <div className="panel-card">
              <h3>🚧 Part A.6 Extension: Mid-Trip Road Closure &amp; Incremental A* Repair</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                Simulate up to 3 additional highway segments becoming blocked after the initial route is computed.
                VoltPath preserves the valid upstream prefix up to the <strong>Divergence Node</strong> and repairs only the affected downstream subgraph without recomputing from scratch.
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
                {[
                  { key: 'N08-N10', label: 'N08-N10 (Sutlej Valley Highway: Bahawalpur -> Sahiwal)' },
                  { key: 'N03-N06', label: 'N03-N06 (N-5 Rohri Corridor: Nawabshah -> Sukkur)' },
                  { key: 'N07-N09', label: 'N07-N09 (M-5 Direct: Rahim Yar Khan -> Multan)' }
                ].map((item) => (
                  <label
                    key={item.key}
                    style={{
                      background: '#0f172a',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #334155',
                      fontSize: '0.83rem',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedClosures.includes(item.key)}
                      onChange={() => toggleClosure(item.key)}
                      style={{ marginRight: 8 }}
                    />
                    {item.label}
                  </label>
                ))}
                <button className="btn-primary" onClick={handleRunIncremental}>
                  Run Incremental Repair
                </button>
              </div>

              <div className="kpi-grid" style={{ marginBottom: 16 }}>
                <div className="kpi-card">
                  <div className="kpi-label">Local Divergence Node</div>
                  <div className="kpi-value" style={{ fontSize: '1.05rem', color: '#38bdf8' }}>
                    {incResult.divergence_node_name || incResult.divergence_node_id}
                  </div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Incremental Nodes Expanded</div>
                  <div className="kpi-value" style={{ color: '#4ade80' }}>
                    {incResult.incremental_nodes_expanded}
                  </div>
                  <div className="kpi-sub">
                    vs Full Scratch: {incResult.full_scratch_nodes_expanded} ({incResult.nodes_saved_pct}% saved)
                  </div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Updated Route Distance</div>
                  <div className="kpi-value">{incResult.updated_distance_km} km</div>
                  <div className="kpi-sub">Initial Distance: {incResult.initial_distance_km} km</div>
                </div>
              </div>

              <h4>Initial Route:</h4>
              <div className="route-chain" style={{ marginBottom: 14 }}>
                {(incResult.initial_route_names || []).map((n, i) => (
                  <span key={i} className="route-node-chip">
                    {n}
                  </span>
                ))}
              </div>

              <h4>Repaired Route (After Mid-Trip Road Closures):</h4>
              <div className="route-chain">
                {(incResult.updated_route_names || []).map((n, i) => (
                  <span key={i} className="route-node-chip stop">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EDGE CASES (WP5) */}
          {activeTab === 'edgecases' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {edgeCases.map((ec) => (
                <div key={ec.id} className="panel-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>{ec.title}</h3>
                    <span className="pill fallback">{ec.cep_ref}</span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.86rem', marginTop: 4 }}>
                    {ec.description}
                  </p>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Returned Status: </strong>
                    <span style={{ color: '#fbbf24', fontFamily: 'monospace', fontWeight: 700 }}>
                      {ec.result.status}
                    </span>
                  </div>
                  {(ec.result.warnings || []).map((w, i) => (
                    <div key={i} className="error-banner">
                      {w}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: SENSITIVITY & COMPLEXITY (PART C & WP3) */}
          {activeTab === 'sensitivity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="panel-card">
                <h3>📊 Part C: Sensitivity Analysis (Disabling Key Hubs: {(sensitivity.removed_hubs || []).join(', ')})</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Baseline Network</th>
                      <th>Perturbed Network (Hubs Removed)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>A* Route Distance</strong></td>
                      <td>{sensitivity.baseline_distance_km} km</td>
                      <td>{sensitivity.perturbed_distance_km} km (Re-routed via Multan N09)</td>
                    </tr>
                    <tr>
                      <td><strong>Total Charging Cost (DP)</strong></td>
                      <td>PKR {Number(sensitivity.baseline_cost_pkr).toLocaleString()}</td>
                      <td>PKR {Number(sensitivity.perturbed_cost_pkr).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td><strong>Total Trip Duration</strong></td>
                      <td>{sensitivity.baseline_time_hours} hrs</td>
                      <td>{sensitivity.perturbed_time_hours} hrs</td>
                    </tr>
                    <tr>
                      <td><strong>Selected Charging Stops</strong></td>
                      <td>{(sensitivity.baseline_stops || []).join(' -> ')}</td>
                      <td>{(sensitivity.perturbed_stops || []).join(' -> ')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="panel-card">
                <h3>🧮 WP3: Formal Algorithmic Time &amp; Space Complexity Summary</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Module / Paradigm</th>
                      <th>Time Complexity</th>
                      <th>Space Complexity</th>
                      <th>Brute-Force Comparison</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Part A: A* Route Search</strong> (Adjacency List + Binary Min-Heap)</td>
                      <td><code>O((|V| + |E|) log |V|)</code></td>
                      <td><code>O(|V| + |E|)</code></td>
                      <td><code>O(|V|!)</code> simple path enumeration</td>
                    </tr>
                    <tr>
                      <td><strong>Part B: Multi-Stage Charging DP</strong> (k stations, B discrete kWh levels)</td>
                      <td><code>O(k * B^2 * P)</code></td>
                      <td><code>O(k * B * P)</code></td>
                      <td><code>O(B^k) = 64^9 ≈ 1.8 × 10^16</code> states (Infeasible)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
