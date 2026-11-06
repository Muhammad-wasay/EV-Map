import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import ChargingNetworkView from './ChargingNetworkView.jsx'
import SavedTripsAnalyticsView from './SavedTripsAnalyticsView.jsx'
import VehicleSpecsTelemetryView from './VehicleSpecsTelemetryView.jsx'
import {
  MOCK_DEFAULT_PLAN,
  MOCK_EDGE_CASES,
  MOCK_INCREMENTAL,
  MOCK_NETWORK,
  MOCK_SENSITIVITY
} from './mockFallback.js'

const API_BASE = 'http://127.0.0.1:8000'

export default function App() {
  // Navigation: EXACT 4 STITCH TABS
  const [activeTab, setActiveTab] = useState('route-planner')
  const [mapMode, setMapMode] = useState('leaflet') // 'leaflet' or 'vector'
  const [backendStatus, setBackendStatus] = useState('CHECKING')
  const [network, setNetwork] = useState(MOCK_NETWORK)
  const [plan, setPlan] = useState(MOCK_DEFAULT_PLAN)
  const [incResult, setIncResult] = useState(MOCK_INCREMENTAL)
  const [edgeCases, setEdgeCases] = useState(MOCK_EDGE_CASES)
  const [sensitivity, setSensitivity] = useState(MOCK_SENSITIVITY)
  const [loading, setLoading] = useState(false)
  const [activeStationPopup, setActiveStationPopup] = useState(null)
  const [showItemizedCost, setShowItemizedCost] = useState(false)
  const [selectedCorridorRoute, setSelectedCorridorRoute] = useState('M5') // 'M5' or 'N5'

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

  // Initial Fetch from FastAPI Backend
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

  // Robust Leaflet Map Rendering & Lifecycle Management
  useEffect(() => {
    if (activeTab !== 'route-planner' || mapMode !== 'leaflet') return

    // Allow DOM to settle
    const initTimer = setTimeout(() => {
      const container = mapContainerRef.current
      if (!container) return

      // Clean up previous instance cleanly
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }

      // Reset any internal Leaflet ID on the DOM node to prevent "already initialized" error
      if (container._leaflet_id) {
        delete container._leaflet_id
      }

      // Initialize fresh Leaflet Map centered on Pakistan EV Supercorridor
      const map = L.map(container, {
        zoomControl: false,
        attributionControl: false,
        preferCanvas: true
      }).setView([29.3, 70.8], 6)

      // Add CartoDB Voyager Tile Layer (clean, high-contrast, modern)
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          maxZoom: 19,
          subdomains: 'abcd'
        }
      ).addTo(map)

      const lg = L.layerGroup().addTo(map)
      layerGroupRef.current = lg
      leafletMapRef.current = map

      const nodeMap = {}
      network.nodes.forEach((n) => {
        nodeMap[n.node_id] = n
      })

      // 1. Draw highway edge network
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
            color: e.is_blocked ? '#e11d48' : '#cbd5e1',
            weight: e.is_blocked ? 2.5 : 4,
            dashArray: e.is_blocked ? '6, 6' : null,
            opacity: e.is_blocked ? 0.8 : 0.7
          }
        )
          .bindPopup(
            `<div class="p-2 text-xs font-sans">
              <strong class="text-slate-900 font-bold block mb-0.5">${e.road_name}</strong>
              <div class="text-slate-600">${e.distance_km} km • ${e.speed_kmh} km/h</div>
              ${
                e.is_blocked
                  ? '<div class="text-rose-600 font-bold mt-1 uppercase text-[10px]">⚠️ Road Blocked / Submerged</div>'
                  : '<div class="text-emerald-700 font-bold mt-1 text-[10px]">✓ Open Motorway Corridor</div>'
              }
            </div>`
          )
          .addTo(lg)
      })

      // 2. Highlight active A* route corridor
      if (plan.route_node_ids && plan.route_node_ids.length > 1) {
        const routeLatLngs = plan.route_node_ids
          .map((id) => nodeMap[id])
          .filter(Boolean)
          .map((n) => [n.lat, n.lon])

        // Outer neon glow line
        L.polyline(routeLatLngs, {
          color: '#10b981',
          weight: 9,
          opacity: 0.35,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(lg)

        // Inner solid route line
        const routeLine = L.polyline(routeLatLngs, {
          color: '#0f766e',
          weight: 4.5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(lg)

        if (routeLatLngs.length > 0) {
          map.fitBounds(routeLine.getBounds(), { padding: [50, 50], maxZoom: 8 })
        }
      }

      // 3. Charging Stop Lookups
      const stopLookup = {}
      ;(plan.charging_stops || []).forEach((s) => {
        stopLookup[s.node_id] = s
      })

      // 4. Node Markers
      network.nodes.forEach((n) => {
        const st = n.station
        const stopInfo = stopLookup[n.node_id]
        const isRoute = (plan.route_node_ids || []).includes(n.node_id)
        const isOrigin = n.node_id === originId
        const isDest = n.node_id === destId

        let fillColor = '#64748b'
        let radius = 6
        let strokeColor = '#ffffff'
        let strokeWidth = 2

        if (isOrigin) {
          fillColor = '#0f766e'
          radius = 10
          strokeWidth = 3
        } else if (isDest) {
          fillColor = '#e11d48'
          radius = 10
          strokeWidth = 3
        } else if (stopInfo) {
          fillColor = '#10b981'
          radius = 9
          strokeWidth = 2.5
        } else if (isRoute) {
          fillColor = '#0284c7'
          radius = 7
        }

        const marker = L.circleMarker([n.lat, n.lon], {
          radius,
          fillColor,
          color: strokeColor,
          weight: strokeWidth,
          fillOpacity: 1
        }).addTo(lg)

        marker.bindTooltip(
          `<span class="font-bold text-xs">${n.name}</span>${
            stopInfo ? ` <span class="text-emerald-700 font-bold">(DP Stop: +${stopInfo.charged_kwh} kWh)</span>` : ''
          }`,
          { direction: 'top', offset: [0, -8] }
        )

        marker.on('click', () => {
          if (st) {
            setActiveStationPopup({
              ...st,
              cityName: n.name,
              nodeId: n.node_id,
              stopInfo
            })
          }
        })
      })

      // Force recalculation of container dimensions
      map.invalidateSize()
    }, 60)

    return () => {
      clearTimeout(initTimer)
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [activeTab, mapMode, network, plan, originId, destId])

  function handleMapZoom(direction) {
    if (!leafletMapRef.current) return
    if (direction === 'in') leafletMapRef.current.zoomIn()
    if (direction === 'out') leafletMapRef.current.zoomOut()
  }

  function handleMapRecenter() {
    if (!leafletMapRef.current) return
    const nodeMap = {}
    network.nodes.forEach((n) => {
      nodeMap[n.node_id] = n
    })
    if (plan.route_node_ids && plan.route_node_ids.length > 1) {
      const coords = plan.route_node_ids
        .map((id) => nodeMap[id])
        .filter(Boolean)
        .map((n) => [n.lat, n.lon])
      if (coords.length > 0) {
        leafletMapRef.current.fitBounds(coords, { padding: [50, 50], maxZoom: 8 })
        return
      }
    }
    leafletMapRef.current.setView([29.3, 70.8], 6)
  }

  async function executePlannerWithParams(params) {
    setLoading(true)
    try {
      const resp = await fetch(`${API_BASE}/api/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })
      if (!resp.ok) throw new Error('Planner API returned non-200')
      const data = await resp.json()
      setPlan(data.plan)
      setBackendStatus('FASTAPI_ONLINE')
    } catch (err) {
      setBackendStatus('MOCK_FALLBACK')
      setPlan(MOCK_DEFAULT_PLAN)
    } finally {
      setLoading(false)
    }
  }

  async function handleRunPlanner(e) {
    if (e) e.preventDefault()
    executePlannerWithParams({
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
  }

  function applyPreset(presetType) {
    setActiveTab('route-planner')
    if (presetType === 'OPTIMAL') {
      setOriginId('N01')
      setDestId('N14')
      setBatteryCap(75)
      setInitialSoc(65)
      setMinReserve(12)
      setMaxTime(18.5)
      executePlannerWithParams({
        origin_id: 'N01',
        dest_id: 'N14',
        max_allowed_time_hours: 18.5,
        battery_capacity_kwh: 75,
        initial_soc_kwh: 65,
        min_reserve_kwh: 12,
        consumption_kwh_per_km: 0.18,
        max_charge_acceptance_kw: 120.0,
        use_live_api: useLiveApi
      })
    } else if (presetType === 'FAST') {
      setOriginId('N01')
      setDestId('N14')
      setBatteryCap(75)
      setInitialSoc(65)
      setMinReserve(12)
      setMaxTime(17.75)
      executePlannerWithParams({
        origin_id: 'N01',
        dest_id: 'N14',
        max_allowed_time_hours: 17.75,
        battery_capacity_kwh: 75,
        initial_soc_kwh: 65,
        min_reserve_kwh: 12,
        consumption_kwh_per_km: 0.18,
        max_charge_acceptance_kw: 120.0,
        use_live_api: useLiveApi
      })
    } else if (presetType === 'TIGHT_EDGE') {
      setOriginId('N01')
      setDestId('N14')
      setBatteryCap(75)
      setInitialSoc(65)
      setMinReserve(12)
      setMaxTime(11.0)
      executePlannerWithParams({
        origin_id: 'N01',
        dest_id: 'N14',
        max_allowed_time_hours: 11.0,
        battery_capacity_kwh: 75,
        initial_soc_kwh: 65,
        min_reserve_kwh: 12,
        consumption_kwh_per_km: 0.18,
        max_charge_acceptance_kw: 120.0,
        use_live_api: useLiveApi
      })
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

  const totalCostPKR = Number(plan.total_charging_cost_pkr || 11012)
  const estTollsPKR = 4350
  const grandTotalPKR = totalCostPKR + estTollsPKR
  const petrolComparisonPKR = 38270
  const fuelSavingsPKR = Math.max(0, petrolComparisonPKR - grandTotalPKR)

  return (
    <div className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. TOP STITCH GLASS HEADER BAR (EXACT 4 COLUMNS, CLEAN MODERN EDGES) */}
      <header className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <div className="h-16 w-full px-4 lg:px-8 flex items-center justify-between">
          <div className="pointer-events-auto flex items-center gap-4">
            {/* Brand Logo */}
            <div
              onClick={() => setActiveTab('route-planner')}
              className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-slate-300 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-[19px]">bolt</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-slate-900 tracking-tight leading-none">
                  VoltPath
                </span>
                <span className="text-[10px] text-slate-500 font-semibold leading-none mt-0.5">
                  EV Intelligence
                </span>
              </div>
            </div>

            {/* Top Navigation: EXACT 4 TABS MATCHING STITCH DESIGN */}
            <nav className="hidden md:flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-sm border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('route-planner')}
                className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
                  activeTab === 'route-planner'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Route Planner
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('charging-directory')}
                className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
                  activeTab === 'charging-directory'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Charging Network Directory
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('saved-trips')}
                className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
                  activeTab === 'saved-trips'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Saved Trips
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('vehicle-specs')}
                className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
                  activeTab === 'vehicle-specs'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Vehicle Specs
              </button>
            </nav>
          </div>

          {/* Right Live Status Badges matching Screenshot */}
          <div className="pointer-events-auto flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-slate-200 text-xs font-semibold text-slate-800">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">electric_car</span>
              <span className="font-mono">82% • 274 mi</span>
            </div>

            <button
              type="button"
              title="Eco Optimization Active"
              className="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center text-emerald-600 hover:bg-slate-100 shadow-sm border border-slate-200 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">eco</span>
            </button>

            <button
              type="button"
              title="Highway Alerts"
              className="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 shadow-sm border border-slate-200 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
            </button>

            <div
              title="Driver Profile"
              className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="pt-16 w-full flex-1 flex flex-col relative overflow-hidden">
        {/* PAGE 1: ROUTE PLANNER */}
        {activeTab === 'route-planner' && (
          <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden flex flex-col md:flex-row">
            {/* MAP VIEW CONTAINER (LEAFLET OR STYLIZED VECTOR) */}
            {mapMode === 'leaflet' ? (
              <div
                ref={mapContainerRef}
                id="voltpath-leaflet-map"
                className="absolute inset-0 z-0 bg-slate-100 w-full h-full"
              />
            ) : (
              /* STITCH STYLIZED VECTOR CORRIDOR CANVAS */
              <div className="absolute inset-0 z-0 bg-slate-900 overflow-hidden select-none">
                <svg
                  className="w-full h-full object-cover"
                  fill="none"
                  preserveAspectRatio="xMidYMid slice"
                  viewBox="0 0 1600 1000"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="routeGlow" x1="0%" x2="50%" y1="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#34d399" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
                    </linearGradient>
                    <filter height="140%" id="softGlow" width="140%" x="-20%" y="-20%">
                      <feGaussianBlur result="blur" stdDeviation="6" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  {/* Topography & Rivers */}
                  <path
                    d="M-100,200 C300,180 500,420 700,480 C950,560 1200,400 1700,500 L1700,1100 L-100,1100 Z"
                    fill="#1e293b"
                    opacity="0.5"
                  />
                  <path
                    d="M200,980 C380,820 540,730 620,590 C700,450 730,340 850,220 C950,120 1100,80 1300,50"
                    opacity="0.3"
                    stroke="#0284c7"
                    strokeLinecap="round"
                    strokeWidth="16"
                  />
                  {/* Highway Corridors */}
                  <path
                    d="M480,910 C510,840 560,790 610,720 C680,620 730,540 760,460 C790,380 840,290 890,210"
                    filter="url(#softGlow)"
                    stroke="url(#routeGlow)"
                    strokeLinecap="round"
                    strokeWidth="6"
                  />
                  <path
                    className="animate-pulse"
                    d="M480,910 C510,840 560,790 610,720 C680,620 730,540 760,460 C790,380 840,290 890,210"
                    stroke="#ffffff"
                    strokeDasharray="10 18"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                  {/* Highway Labels */}
                  <text fill="#64748b" fontSize="12" fontWeight="700" letterSpacing="1" x="525" y="810">
                    M-9 MOTORWAY
                  </text>
                  <text fill="#64748b" fontSize="12" fontWeight="700" letterSpacing="1" x="685" y="605">
                    M-5 SUKKUR-MULTAN
                  </text>
                  <text fill="#64748b" fontSize="12" fontWeight="700" letterSpacing="1" x="825" y="380">
                    M-2 MOTORWAY
                  </text>
                  {/* Origin: Karachi */}
                  <g transform="translate(480, 910)">
                    <circle fill="#10b981" opacity="0.3" r="22" className="animate-ping" />
                    <circle fill="#ffffff" r="12" />
                    <circle fill="#0f766e" r="6" />
                    <rect fill="#0f172a" height="26" rx="6" width="120" x="-60" y="20" />
                    <text fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle" x="0" y="37">
                      Karachi (Sindh)
                    </text>
                  </g>
                  {/* Destination: Islamabad */}
                  <g transform="translate(890, 210)">
                    <circle fill="#e11d48" opacity="0.3" r="22" className="animate-pulse" />
                    <circle fill="#ffffff" r="12" />
                    <circle fill="#e11d48" r="6" />
                    <rect fill="#0f172a" height="26" rx="6" width="120" x="-60" y="-38" />
                    <text fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle" x="0" y="-21">
                      Islamabad (Capital)
                    </text>
                  </g>
                  {/* Stops */}
                  {[
                    { x: 585, y: 755, name: 'Moro HyperCharge (150kW)' },
                    { x: 685, y: 615, name: 'RYK Oasis (180kW)' },
                    { x: 760, y: 460, name: 'Multan Express (80kW)' }
                  ].map((st, i) => (
                    <g key={i} transform={`translate(${st.x}, ${st.y})`} className="cursor-pointer">
                      <circle fill="#10b981" opacity="0.4" r="16" />
                      <circle fill="#ffffff" r="9" />
                      <circle fill="#059669" r="5" />
                      <text fill="#cbd5e1" fontSize="10" fontWeight="600" textAnchor="start" x="16" y="4">
                        {st.name}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            )}

            {/* Top Toolbar: Presets + Map View Mode Selector */}
            <div className="absolute top-3 left-4 md:left-[430px] right-4 z-20 pointer-events-auto flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('OPTIMAL')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white shadow-sm text-xs font-semibold shrink-0 hover:bg-emerald-800 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  <span>Standard (18.5h Min Cost)</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset('FAST')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-md text-slate-800 shadow-sm text-xs font-medium shrink-0 border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px] text-emerald-600">bolt</span>
                  <span>HyperCharge Rush (17.75h)</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset('TIGHT_EDGE')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-md text-slate-800 shadow-sm text-xs font-medium shrink-0 border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px] text-rose-600">timer_off</span>
                  <span>T_max 11h Edge Fallback</span>
                </button>
              </div>

              {/* Map Mode Switcher */}
              <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-lg border border-slate-200 shadow-sm text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMapMode('leaflet')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                    mapMode === 'leaflet'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">map</span>
                  <span className="hidden sm:inline">Leaflet GIS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode('vector')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                    mapMode === 'vector'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">polyline</span>
                  <span className="hidden sm:inline">Vector Stitch</span>
                </button>
              </div>
            </div>

            {/* Map Floating Navigation Controls */}
            <div className="fixed right-6 bottom-6 z-30 flex flex-col gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={handleMapRecenter}
                title="Recenter Highway Corridor"
                className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center text-slate-700 shadow-md border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">my_location</span>
              </button>

              <div className="flex flex-col bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleMapZoom('in')}
                  title="Zoom In"
                  className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors border-b border-slate-200"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMapZoom('out')}
                  title="Zoom Out"
                  className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
              </div>
            </div>

            {/* LEFT ROUTE CONTROLLER (PROFESSIONAL CRISP CARD, CLEAN ALIGNMENT) */}
            <div className="relative md:absolute md:left-6 md:top-3 md:bottom-3 z-30 w-full md:w-[390px] flex flex-col justify-end md:justify-start pointer-events-none mt-auto md:mt-0 p-2 md:p-0">
              <div className="pointer-events-auto w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_35px_-4px_rgba(15,23,42,0.14)] border border-slate-200/90 flex flex-col max-h-[calc(100vh-5.5rem)] overflow-hidden">
                
                {/* Header: Origin & Destination */}
                <div className="p-4 pb-3 flex flex-col gap-3 bg-slate-50/70 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-[20px]">alt_route</span>
                      <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                        Express EV Routing
                      </span>
                    </div>

                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                      <span className="material-symbols-outlined text-[14px]">battery_charging_full</span>
                      <span>{Math.round((initialSoc / batteryCap) * 100)}% SoC</span>
                    </div>
                  </div>

                  <form onSubmit={handleRunPlanner} className="flex flex-col gap-2.5">
                    {/* Origin / Dest Stack */}
                    <div className="relative flex flex-col gap-2 bg-white rounded-xl p-2.5 border border-slate-200">
                      <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-slate-200" />

                      <div className="flex items-center gap-2.5 relative z-10">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] text-slate-500 uppercase font-bold block leading-none mb-1">
                            STARTING POINT
                          </span>
                          <select
                            value={originId}
                            onChange={(e) => setOriginId(e.target.value)}
                            className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer"
                          >
                            {network.nodes.map((n) => (
                              <option key={n.node_id} value={n.node_id}>
                                {n.node_id} — {n.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 relative z-10 pt-1">
                        <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[13px] text-rose-600">location_on</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] text-slate-500 uppercase font-bold block leading-none mb-1">
                            FINAL DESTINATION
                          </span>
                          <select
                            value={destId}
                            onChange={(e) => setDestId(e.target.value)}
                            className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer"
                          >
                            {network.nodes.map((n) => (
                              <option key={n.node_id} value={n.node_id}>
                                {n.node_id} — {n.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Corridor Selector: M-5 vs N-5 */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCorridorRoute('M5')}
                        className={`p-2 rounded-xl text-left border transition-all ${
                          selectedCorridorRoute === 'M5'
                            ? 'bg-emerald-50/80 border-emerald-600 text-slate-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[9px] font-bold text-emerald-800 uppercase px-1 rounded bg-emerald-200/60">
                            Fastest
                          </span>
                          {selectedCorridorRoute === 'M5' && (
                            <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                          )}
                        </div>
                        <div className="text-xs font-bold">via M-5 Motorway</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">18h 30m • 1,505 km</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCorridorRoute('N5')}
                        className={`p-2 rounded-xl text-left border transition-all ${
                          selectedCorridorRoute === 'N5'
                            ? 'bg-emerald-50/80 border-emerald-600 text-slate-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[9px] font-bold text-slate-500 uppercase px-1 rounded bg-slate-100">
                            Alt Path
                          </span>
                          <span className="text-[9px] font-bold text-rose-600">+1h 45m</span>
                        </div>
                        <div className="text-xs font-bold">via N-5 Highway</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">20h 15m • 1,543 km</div>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.99]"
                    >
                      <span className="material-symbols-outlined text-[16px] text-emerald-400">bolt</span>
                      <span>{loading ? 'Optimizing Route & Charging...' : 'Calculate Optimal Itinerary'}</span>
                    </button>
                  </form>
                </div>

                {/* KPI Strip */}
                <div className="grid grid-cols-4 gap-1.5 p-2.5 text-center border-b border-slate-200 bg-slate-50">
                  <div className="bg-white rounded-lg p-1.5 border border-slate-200/80">
                    <span className="text-[9px] text-slate-500 uppercase block font-bold">Distance</span>
                    <span className="text-xs font-bold text-slate-900 font-mono">{plan.total_distance_km} km</span>
                  </div>
                  <div className="bg-white rounded-lg p-1.5 border border-slate-200/80">
                    <span className="text-[9px] text-slate-500 uppercase block font-bold">Trip Time</span>
                    <span className="text-xs font-bold text-slate-900 font-mono">{plan.total_trip_time_hours}h</span>
                  </div>
                  <div className="bg-white rounded-lg p-1.5 border border-slate-200/80">
                    <span className="text-[9px] text-slate-500 uppercase block font-bold">DP Stops</span>
                    <span className="text-xs font-bold text-emerald-700">{plan.charging_stops?.length || 0} Hubs</span>
                  </div>
                  <div className="bg-white rounded-lg p-1.5 border border-slate-200/80">
                    <span className="text-[9px] text-slate-500 uppercase block font-bold">Energy Cost</span>
                    <span className="text-xs font-bold text-emerald-700 font-mono">PKR {Math.round(totalCostPKR / 1000)}k</span>
                  </div>
                </div>

                {/* Cost Breakdown & Savings Summary */}
                <div className="p-3 bg-white border-b border-slate-200 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-slate-600">receipt_long</span>
                      <span className="text-xs font-bold text-slate-900">Total Corridor Budget</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900 font-mono">
                        PKR {grandTotalPKR.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowItemizedCost(!showItemizedCost)}
                        className="text-[10px] text-emerald-700 font-bold hover:underline"
                      >
                        {showItemizedCost ? 'Hide' : 'Details'}
                      </button>
                    </div>
                  </div>

                  {showItemizedCost && (
                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-[11px]">
                      <div className="flex justify-between text-slate-600">
                        <span>⚡ EV Charging (3 Hubs):</span>
                        <strong className="text-slate-900">PKR {totalCostPKR.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>🛣️ Motorway M-Tag Tolls:</span>
                        <strong className="text-slate-900">PKR {estTollsPKR.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>❄️ Battery Conditioning:</span>
                        <strong className="text-slate-900">Included</strong>
                      </div>
                    </div>
                  )}

                  <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-200 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">savings</span>
                    <div className="flex-1 min-w-0 text-[10px] text-slate-700">
                      <strong className="text-emerald-900 font-bold block">
                        ⚡ Saves PKR {fuelSavingsPKR.toLocaleString()} vs Petrol ICE
                      </strong>
                      63% cheaper than equivalent petrol journey (PKR {petrolComparisonPKR.toLocaleString()})
                    </div>
                  </div>
                </div>

                {/* Timeline Stops */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-none">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Multi-Stage Dynamic Programming Stops
                  </div>

                  {(plan.charging_stops || []).map((stop, i) => (
                    <div key={i} className="relative pl-5">
                      <div className="absolute left-1.5 top-2 bottom-0 w-0.5 bg-slate-200" />
                      <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-600 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>

                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 truncate">{stop.city_name}</span>
                          <span className="text-[10px] font-bold text-emerald-800 px-1.5 py-0.5 rounded bg-emerald-100 font-mono">
                            +{stop.charged_kwh} kWh
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{stop.station_name}</div>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/80 font-mono">
                          <span className="text-slate-600">
                            {stop.arrival_soc_kwh} &rarr; <strong className="text-slate-900">{stop.departure_soc_kwh} kWh</strong>
                          </span>
                          <strong className="text-emerald-700">
                            PKR {stop.charge_cost_pkr.toLocaleString()}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Station Popup Card */}
            {activeStationPopup && (
              <div className="absolute right-6 top-16 z-30 w-80 bg-white rounded-xl p-4 shadow-xl border border-slate-200 flex flex-col gap-2.5 pointer-events-auto">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      {activeStationPopup.cityName} • {activeStationPopup.nodeId}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {activeStationPopup.name}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveStationPopup(null)}
                    className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-lg p-2 text-xs border border-slate-200">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Tariff</span>
                    <strong className="text-slate-900 font-mono">PKR {activeStationPopup.cost_per_kwh}/kWh</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Power</span>
                    <strong className="text-emerald-700 font-mono">{activeStationPopup.power_kw} kW DC</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>Connectors: CCS2 • Type 2</span>
                  <span className="font-bold text-emerald-700">Active</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PAGE 2: CHARGING NETWORK DIRECTORY */}
        {activeTab === 'charging-directory' && (
          <ChargingNetworkView
            network={network}
            onSelectStation={(st) => {
              setActiveStationPopup({
                ...st,
                cityName: st.city_name,
                nodeId: st.node_id
              })
              setActiveTab('route-planner')
            }}
          />
        )}

        {/* PAGE 3: SAVED TRIPS & COST ANALYTICS */}
        {activeTab === 'saved-trips' && <SavedTripsAnalyticsView plan={plan} />}

        {/* PAGE 4: VEHICLE SPECS & BATTERY TELEMETRY */}
        {activeTab === 'vehicle-specs' && (
          <VehicleSpecsTelemetryView
            batteryCap={batteryCap}
            setBatteryCap={setBatteryCap}
            initialSoc={initialSoc}
            setInitialSoc={setInitialSoc}
            minReserve={minReserve}
            setMinReserve={setMinReserve}
            maxTime={maxTime}
            setMaxTime={setMaxTime}
          />
        )}
      </main>
    </div>
  )
}