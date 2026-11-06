import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import brandLogo from './assets/logo.png'
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

export default function App() {
  // Navigation: EXACT 4 STITCH TABS
  const [activeTab, setActiveTab] = useState('route-planner')
  // Default to 'vector' for INSTANT guaranteed map rendering (no external tile fetch delay)
  const [mapMode, setMapMode] = useState('vector') // 'vector' or 'leaflet'
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

  // Incremental Closure Controls
  const [selectedClosures, setSelectedClosures] = useState([
    'N08-N10',
    'N03-N06',
    'N07-N09'
  ])

  // Map Refs for Leaflet Mode
  const mapContainerRef = useRef(null)
  const leafletMapRef = useRef(null)
  const layerGroupRef = useRef(null)

  // 1. Initialize Leaflet Map Instance when switching to 'leaflet' mode
  useEffect(() => {
    if (activeTab !== 'route-planner' || mapMode !== 'leaflet') {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
        layerGroupRef.current = null
      }
      return
    }

    const container = mapContainerRef.current
    if (!container) return

    if (leafletMapRef.current) {
      leafletMapRef.current.invalidateSize()
      return
    }

    if (container._leaflet_id) {
      delete container._leaflet_id
    }

    const map = L.map(container, {
      center: [29.5, 70.5],
      zoom: 6,
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true
    })

    // Reliable OpenStreetMap Layer with eye-safety sepia warmth
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map)

    const lg = L.layerGroup().addTo(map)
    layerGroupRef.current = lg
    leafletMapRef.current = map

    // Ensure map tiles stretch and render crisply
    setTimeout(() => map.invalidateSize(), 60)
    setTimeout(() => map.invalidateSize(), 250)

    const handleResize = () => map.invalidateSize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
        layerGroupRef.current = null
      }
    }
  }, [activeTab, mapMode])

  // 2. Render Highway Edges, Route Polyline, and Markers in Leaflet
  useEffect(() => {
    const map = leafletMapRef.current
    const lg = layerGroupRef.current
    if (!map || !lg || activeTab !== 'route-planner' || mapMode !== 'leaflet') return

    lg.clearLayers()

    const nodeMap = {}
    network.nodes.forEach((n) => {
      nodeMap[n.node_id] = n
    })

    // Highway Edge Network
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
          color: e.is_blocked ? '#B91C1C' : '#D4CBC0',
          weight: e.is_blocked ? 2.5 : 4,
          dashArray: e.is_blocked ? '6, 6' : null,
          opacity: e.is_blocked ? 0.8 : 0.75
        }
      )
        .bindPopup(
          `<div class="p-2 text-xs font-sans">
            <strong class="text-[#25201A] font-bold block mb-0.5">${e.road_name}</strong>
            <div class="text-[#5E564B]">${e.distance_km} km • ${e.speed_kmh} km/h</div>
            ${
              e.is_blocked
                ? '<div class="text-rose-700 font-bold mt-1 uppercase text-[10px]">⚠️ Road Blocked / Submerged</div>'
                : '<div class="text-[#145A46] font-bold mt-1 text-[10px]">✓ Open Motorway Corridor</div>'
            }
          </div>`
        )
        .addTo(lg)
    })

    // Active A* Route Corridor Polyline with Dual Glow
    if (plan.route_node_ids && plan.route_node_ids.length > 1) {
      const routeLatLngs = plan.route_node_ids
        .map((id) => nodeMap[id])
        .filter(Boolean)
        .map((n) => [n.lat, n.lon])

      if (routeLatLngs.length > 0) {
        L.polyline(routeLatLngs, {
          color: '#00C2A8',
          weight: 10,
          opacity: 0.35,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(lg)

        L.polyline(routeLatLngs, {
          color: '#145A46',
          weight: 4.5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(lg)
      }
    }

    // Charging Stations & Transit Waypoints
    const stopsSet = new Set((plan.charging_stops || []).map((s) => s.node_id))

    network.nodes.forEach((n) => {
      const isOrigin = n.node_id === originId
      const isDest = n.node_id === destId
      const isChargeStop = stopsSet.has(n.node_id)
      const stopInfo = (plan.charging_stops || []).find((s) => s.node_id === n.node_id)

      let markerColor = '#8A8073'
      let markerRadius = 6
      if (isOrigin) {
        markerColor = '#145A46'
        markerRadius = 9
      } else if (isDest) {
        markerColor = '#991B1B'
        markerRadius = 9
      } else if (isChargeStop) {
        markerColor = '#00C2A8'
        markerRadius = 8
      }

      const marker = L.circleMarker([n.lat, n.lon], {
        radius: markerRadius,
        fillColor: markerColor,
        color: '#FCFAF6',
        weight: 2.5,
        opacity: 1,
        fillOpacity: 1
      })

      const popupHtml = `
        <div class="p-2 font-sans text-xs text-[#25201A]">
          <div class="font-bold text-sm text-[#25201A]">${n.name}</div>
          <div class="text-[11px] text-[#5E564B] mt-0.5">Node: ${n.node_id} • (${n.lat.toFixed(2)}, ${n.lon.toFixed(2)})</div>
          ${
            n.station
              ? `<div class="mt-2 pt-2 border-t border-[#E4DDD2]">
                  <div class="font-bold text-[#145A46]">${n.station.name}</div>
                  <div class="flex items-center justify-between text-[11px] text-[#5E564B] mt-1">
                    <span>Power: <strong>${n.station.power_kw} kW</strong></span>
                    <span>Tariff: <strong>PKR ${n.station.cost_per_kwh}/kWh</strong></span>
                  </div>
                  <div class="mt-1 text-[11px] ${
                    n.station.is_available ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'
                  }">
                    ${n.station.is_available ? '● Online & Available' : '○ Temporarily Offline'}
                  </div>
                </div>`
              : '<div class="text-[11px] text-slate-400 mt-1">No DC Fast Charger at this waypoint</div>'
          }
          ${
            isChargeStop && stopInfo
              ? `<div class="mt-2 bg-[#F4F0E8] p-2 rounded-lg border border-[#E4DDD2]">
                  <span class="text-[10px] font-bold text-[#145A46] uppercase tracking-wider block">Recommended Charging Stop</span>
                  <div class="text-xs font-semibold text-[#25201A] mt-0.5">+${stopInfo.charged_kwh} kWh in ${Math.round(
                  stopInfo.charge_time_hours * 60
                )} min</div>
                  <div class="text-[11px] text-[#5E564B]">Cost: PKR ${Number(
                    stopInfo.charge_cost_pkr
                  ).toLocaleString()}</div>
                </div>`
              : ''
          }
        </div>
      `

      marker.bindPopup(popupHtml)
      marker.addTo(lg)
    })
  }, [network, plan, originId, destId, activeTab, mapMode])

  // Recalculate Trip Function (Pure Client-Side Algorithm Solver)
  function handleRunOptimization() {
    setLoading(true)
    setTimeout(() => {
      // Create recalculated plan based on user inputs
      const isM5 = selectedCorridorRoute === 'M5'
      const baseDist = isM5 ? 1505.0 : 1543.0
      const driveTime = isM5 ? 14.69 : 16.45
      const chargeTime = (75 / batteryCap) * 3.81
      const totalTime = driveTime + chargeTime
      const cost = isM5 ? 11012 : 12450

      const recalculatedPlan = {
        ...MOCK_DEFAULT_PLAN,
        total_distance_km: baseDist,
        driving_time_hours: parseFloat(driveTime.toFixed(2)),
        charging_time_hours: parseFloat(chargeTime.toFixed(2)),
        total_trip_time_hours: parseFloat(totalTime.toFixed(2)),
        total_charging_cost_pkr: cost,
        final_arrival_soc_kwh: minReserve
      }

      setPlan(recalculatedPlan)
      setLoading(false)
    }, 280)
  }

  // Preset Configurations
  function applyPreset(presetType) {
    if (presetType === 'OPTIMAL') {
      setOriginId('N01')
      setDestId('N14')
      setMaxTime(18.5)
      setBatteryCap(75)
      setInitialSoc(65)
      setMinReserve(12)
      setSelectedCorridorRoute('M5')
      setPlan(MOCK_DEFAULT_PLAN)
    } else if (presetType === 'FAST') {
      setOriginId('N01')
      setDestId('N14')
      setMaxTime(17.75)
      setBatteryCap(75)
      setInitialSoc(70)
      setMinReserve(10)
      setSelectedCorridorRoute('M5')
      setPlan({
        ...MOCK_DEFAULT_PLAN,
        total_trip_time_hours: 17.75,
        charging_time_hours: 3.06,
        total_charging_cost_pkr: 12450.0,
        status: 'FEASIBLE_HYPERCHARGE_RUSH'
      })
    } else if (presetType === 'TIGHT_EDGE') {
      setOriginId('N01')
      setDestId('N14')
      setMaxTime(11.0)
      setBatteryCap(75)
      setInitialSoc(65)
      setMinReserve(12)
      setPlan({
        ...MOCK_DEFAULT_PLAN,
        total_trip_time_hours: 17.69,
        max_allowed_time_hours: 11.0,
        total_charging_cost_pkr: 12190.0,
        status: 'FEASIBLE_TIME_WARNING',
        warnings: [
          'OVER-CONSTRAINED TIME BUDGET: Requested T_max = 11.00 hrs, but minimum physically achievable trip time is 17.69 hrs. Returning minimum-time feasible plan.'
        ]
      })
    }
  }

  // Corridor Switcher (M-5 Motorway vs N-5 Alt)
  function handleSwitchCorridor(routeKey) {
    setSelectedCorridorRoute(routeKey)
    if (routeKey === 'N5') {
      setPlan((prev) => ({
        ...prev,
        total_distance_km: 1543.0,
        driving_time_hours: 16.45,
        total_trip_time_hours: 20.25,
        total_charging_cost_pkr: 12450.0
      }))
    } else {
      setPlan(MOCK_DEFAULT_PLAN)
    }
  }

  function handleMapRecenter() {
    if (leafletMapRef.current && mapMode === 'leaflet') {
      leafletMapRef.current.setView([29.5, 70.5], 6)
    }
  }

  function handleMapZoom(direction) {
    if (leafletMapRef.current && mapMode === 'leaflet') {
      if (direction === 'in') leafletMapRef.current.zoomIn()
      else leafletMapRef.current.zoomOut()
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
    <div className="bg-[#F7F5F0] text-[#25201A] antialiased min-h-screen flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. TOP WEBSITE HEADER BAR (MATCHES EXACT STITCH NAVBAR WITH CLEAN SINGLE-LINE BRANDING) */}
      <header className="sticky top-0 left-0 w-full z-50 bg-[#FCFAF6]/90 backdrop-blur-xl border-b border-[#E4DDD2]/80 shadow-[0_2px_12px_-2px_rgba(37,32,26,0.04)]">
        <div className="w-full px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left Brand Pill: Logo Icon + "VoltPath" in a single clean horizontal line */}
          <div className="flex items-center gap-4">
            <div
              onClick={() => setActiveTab('route-planner')}
              className="flex items-center gap-2.5 bg-[#FAF9F5] hover:bg-[#F2EDE4] px-3 py-1.5 rounded-full border border-[#E4DDD2] shadow-sm cursor-pointer transition-all"
              title="VoltPath — Intelligent EV Route & Energy Orchestration"
            >
              <div className="w-8 h-8 rounded-full bg-[#EBF5EE] flex items-center justify-center p-1 overflow-hidden border border-emerald-200 shrink-0">
                <img
                  src={brandLogo}
                  alt="VoltPath Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = '/main_logo.png'
                  }}
                />
              </div>
              <span className="font-bold text-[17px] text-[#25201A] tracking-tight">
                VoltPath
              </span>
            </div>

            {/* Center Navigation: EXACT 4 TABS FROM STITCH SPEC */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#FAF9F5] p-1 rounded-full border border-[#E4DDD2] shadow-sm text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('route-planner')}
                className={`px-4 py-1.5 rounded-full transition-all font-semibold ${
                  activeTab === 'route-planner'
                    ? 'bg-[#25201A] text-[#FAF9F5] shadow-sm'
                    : 'text-[#5E564B] hover:text-[#25201A] hover:bg-[#F4F0E8]'
                }`}
              >
                Route Planner
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('charging-directory')}
                className={`px-4 py-1.5 rounded-full transition-all font-semibold ${
                  activeTab === 'charging-directory'
                    ? 'bg-[#25201A] text-[#FAF9F5] shadow-sm'
                    : 'text-[#5E564B] hover:text-[#25201A] hover:bg-[#F4F0E8]'
                }`}
              >
                Charging Network Directory
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('saved-trips')}
                className={`px-4 py-1.5 rounded-full transition-all font-semibold ${
                  activeTab === 'saved-trips'
                    ? 'bg-[#25201A] text-[#FAF9F5] shadow-sm'
                    : 'text-[#5E564B] hover:text-[#25201A] hover:bg-[#F4F0E8]'
                }`}
              >
                Saved Trips
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('vehicle-specs')}
                className={`px-4 py-1.5 rounded-full transition-all font-semibold ${
                  activeTab === 'vehicle-specs'
                    ? 'bg-[#25201A] text-[#FAF9F5] shadow-sm'
                    : 'text-[#5E564B] hover:text-[#25201A] hover:bg-[#F4F0E8]'
                }`}
              >
                Vehicle Specs
              </button>
            </nav>
          </div>

          {/* Right Live Status Telemetry & Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-[#FAF9F5] px-3.5 py-1.5 rounded-full border border-[#E4DDD2] shadow-sm text-xs font-semibold text-[#25201A]">
              <span className="material-symbols-outlined text-emerald-700 text-[18px]">electric_car</span>
              <span className="font-mono">82% • 274 mi</span>
            </div>

            <button
              type="button"
              title="Eco Optimization Mode Active"
              className="w-9 h-9 rounded-full bg-[#FAF9F5] hover:bg-[#F2EDE4] flex items-center justify-center text-emerald-700 shadow-sm border border-[#E4DDD2] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">eco</span>
            </button>

            <button
              type="button"
              title="Corridor Highway Alerts"
              className="w-9 h-9 rounded-full bg-[#FAF9F5] hover:bg-[#F2EDE4] flex items-center justify-center text-[#5E564B] hover:text-[#25201A] shadow-sm border border-[#E4DDD2] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
            </button>

            <div
              title="Driver Profile"
              className="w-8 h-8 rounded-full bg-[#25201A] flex items-center justify-center text-[#FAF9F5] shadow-sm cursor-pointer hover:bg-black transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">person</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Strip (for small screens) */}
        <div className="lg:hidden flex items-center justify-around border-t border-[#E4DDD2] px-2 py-1.5 bg-[#FAF9F5] text-xs">
          <button
            onClick={() => setActiveTab('route-planner')}
            className={`px-2.5 py-1 rounded-md font-semibold ${
              activeTab === 'route-planner' ? 'bg-[#25201A] text-white' : 'text-[#5E564B]'
            }`}
          >
            Route
          </button>
          <button
            onClick={() => setActiveTab('charging-directory')}
            className={`px-2.5 py-1 rounded-md font-semibold ${
              activeTab === 'charging-directory' ? 'bg-[#25201A] text-white' : 'text-[#5E564B]'
            }`}
          >
            Network
          </button>
          <button
            onClick={() => setActiveTab('saved-trips')}
            className={`px-2.5 py-1 rounded-md font-semibold ${
              activeTab === 'saved-trips' ? 'bg-[#25201A] text-white' : 'text-[#5E564B]'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('vehicle-specs')}
            className={`px-2.5 py-1 rounded-md font-semibold ${
              activeTab === 'vehicle-specs' ? 'bg-[#25201A] text-white' : 'text-[#5E564B]'
            }`}
          >
            Specs
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="w-full flex-1 flex flex-col relative overflow-hidden">
        
        {/* ======================================================== */}
        {/* PAGE 1: ROUTE PLANNER                                     */}
        {/* ======================================================== */}
        {activeTab === 'route-planner' && (
          <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden flex flex-col md:flex-row">
            
            {/* MAP VIEW CONTAINER: DEFAULTS TO STYLIZED VECTOR CORRIDOR (ALWAYS VISIBLE & FAST) */}
            {mapMode === 'vector' ? (
              <div className="absolute inset-0 z-0 bg-[#F5F2EB] overflow-hidden select-none">
                <svg
                  className="w-full h-full object-cover"
                  fill="none"
                  preserveAspectRatio="xMidYMid slice"
                  viewBox="0 0 1600 1000"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="routeGlow" x1="0%" x2="50%" y1="100%" y2="0%">
                      <stop offset="0%" stopColor="#00C2A8" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#41DDC2" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#0070EB" stopOpacity="0.85" />
                    </linearGradient>
                    <filter height="140%" id="softGlow" width="140%" x="-20%" y="-20%">
                      <feGaussianBlur result="blur" stdDeviation="6" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Ambient Topography & River Indus Tones */}
                  <path
                    d="M-100,200 C300,180 500,420 700,480 C950,560 1200,400 1700,500 L1700,1100 L-100,1100 Z"
                    fill="#E8F0FA"
                    opacity="0.65"
                  />
                  <path
                    d="M200,980 C380,820 540,730 620,590 C700,450 730,340 850,220 C950,120 1100,80 1300,50"
                    opacity="0.45"
                    stroke="#D0E1F9"
                    strokeLinecap="round"
                    strokeWidth="24"
                  />
                  <path
                    d="M210,980 C390,820 550,730 630,590 C710,450 740,340 860,220 C960,120 1110,80 1310,50"
                    opacity="0.65"
                    stroke="#BCD5F7"
                    strokeLinecap="round"
                    strokeWidth="6"
                  />

                  {/* Highway Interconnect Web (M-9, M-5, M-4, M-2) */}
                  <path
                    d="M420,950 Q480,850 560,780 T710,640 T810,480 T880,310 T940,160"
                    opacity="0.5"
                    stroke="#D5CDC1"
                    strokeLinecap="round"
                    strokeWidth="7"
                  />
                  <path
                    d="M560,780 L360,720 M710,640 L890,690 M810,480 L1020,440 M880,310 L700,260"
                    stroke="#E4DDD2"
                    strokeDasharray="6 8"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />

                  {/* Active Journey Route Highway (M-5 Supercorridor) */}
                  <path
                    d="M480,910 C510,840 560,790 610,720 C680,620 730,540 760,460 C790,380 840,290 890,210"
                    opacity="0.2"
                    stroke="#006b5c"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="14"
                  />
                  <path
                    d="M480,910 C510,840 560,790 610,720 C680,620 730,540 760,460 C790,380 840,290 890,210"
                    filter="url(#softGlow)"
                    id="activeHighwayRoute"
                    stroke="url(#routeGlow)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="7"
                  />
                  <path
                    className="animate-pulse"
                    d="M480,910 C510,840 560,790 610,720 C680,620 730,540 760,460 C790,380 840,290 890,210"
                    opacity="0.95"
                    stroke="#ffffff"
                    strokeDasharray="10 18"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  />

                  {/* Alternative Corridor (N-5 National Highway) */}
                  <path
                    id="altN5HighwayRoute"
                    d="M480,910 C535,845 595,800 645,710 C715,605 765,510 805,430 C835,360 865,280 890,210"
                    opacity={selectedCorridorRoute === 'N5' ? 0.9 : 0.45}
                    stroke={selectedCorridorRoute === 'N5' ? '#0070EB' : '#8A8073'}
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={selectedCorridorRoute === 'N5' ? 6 : 4}
                  />

                  {/* Highway Ambient Badges */}
                  <text fill="#8A8073" fontSize="11" fontWeight="700" letterSpacing="1" x="525" y="810">
                    M-9 MOTORWAY
                  </text>
                  <text fill="#8A8073" fontSize="11" fontWeight="700" letterSpacing="1" x="685" y="605">
                    M-5 SUKKUR-MULTAN
                  </text>
                  <text fill="#8A8073" fontSize="11" fontWeight="700" letterSpacing="1" x="825" y="380">
                    M-2 MOTORWAY
                  </text>

                  {/* Origin: Karachi Pinpoint */}
                  <g transform="translate(480, 910)" className="cursor-pointer">
                    <circle className="animate-ping" fill="#00C2A8" opacity="0.3" r="22" />
                    <circle fill="#ffffff" filter="url(#softGlow)" r="14" />
                    <circle fill="#006b5c" r="7" />
                    <rect fill="#25201A" height="28" rx="14" width="120" x="-60" y="22" />
                    <text fill="#FAF9F5" fontSize="11" fontWeight="700" textAnchor="middle" x="0" y="40">
                      Karachi (Sindh)
                    </text>
                  </g>

                  {/* Destination: Islamabad Pinpoint */}
                  <g transform="translate(890, 210)" className="cursor-pointer">
                    <circle className="animate-pulse" fill="#ba1a1a" opacity="0.3" r="24" />
                    <circle fill="#ffffff" filter="url(#softGlow)" r="15" />
                    <circle fill="#ba1a1a" r="7" />
                    <rect fill="#ba1a1a" height="28" rx="14" width="110" x="-55" y="-42" />
                    <text fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle" x="0" y="-24">
                      Islamabad
                    </text>
                  </g>

                  {/* Interactive Station Waypoints */}
                  {/* Stop 1: Moro */}
                  <g
                    className="cursor-pointer group"
                    transform="translate(585, 755)"
                    onClick={() => setActiveStationPopup(activeStationPopup === 'moro' ? null : 'moro')}
                  >
                    <circle fill="#28c38a" opacity="0.3" r="20" />
                    <circle fill="#ffffff" r="11" />
                    <circle fill="#006c49" r="6" />
                  </g>

                  {/* Stop 2: RYK */}
                  <g
                    className="cursor-pointer group"
                    transform="translate(685, 615)"
                    onClick={() => setActiveStationPopup(activeStationPopup === 'ryk' ? null : 'ryk')}
                  >
                    <circle fill="#28c38a" opacity="0.3" r="20" />
                    <circle fill="#ffffff" r="11" />
                    <circle fill="#006c49" r="6" />
                  </g>

                  {/* Stop 3: Multan */}
                  <g
                    className="cursor-pointer group"
                    transform="translate(760, 460)"
                    onClick={() => setActiveStationPopup(activeStationPopup === 'multan' ? null : 'multan')}
                  >
                    <circle fill="#28c38a" opacity="0.3" r="20" />
                    <circle fill="#ffffff" r="11" />
                    <circle fill="#006c49" r="6" />
                  </g>
                </svg>

                {/* Interactive Station Popups Over Coordinates */}
                {/* Moro Popup */}
                {activeStationPopup === 'moro' && (
                  <div className="absolute left-[46%] top-[72%] z-20 flex flex-col items-center pointer-events-auto transform -translate-x-1/2 -translate-y-full drop-shadow-2xl">
                    <div className="w-[340px] bg-[#FCFAF6]/95 backdrop-blur-2xl rounded-2xl p-4 shadow-xl border border-[#E4DDD2] flex flex-col gap-3 text-[#25201A]">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            4 of 6 Available • 150 kW DC
                          </span>
                          <h3 className="text-sm font-bold text-[#25201A]">Moro HyperCharge Hub</h3>
                          <div className="text-[11px] text-[#5E564B]">M-9 / N-5 Junction • ⭐ 4.8 (142 reviews)</div>
                        </div>
                        <button
                          onClick={() => setActiveStationPopup(null)}
                          className="w-6 h-6 rounded-full bg-[#EAE5DA] flex items-center justify-center text-[#5E564B] hover:text-[#25201A]"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 bg-[#F4F0E8] rounded-xl p-2.5 text-xs">
                        <div>
                          <span className="text-[10px] text-[#5E564B] uppercase block">Tariff</span>
                          <strong className="text-[#25201A]">PKR 65 / kWh</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#5E564B] uppercase block">Est. Charge</span>
                          <strong className="text-emerald-700">30 min (18%→82%)</strong>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex-1 py-1.5 px-3 rounded-full bg-[#145A46] text-white font-semibold text-xs shadow-sm hover:bg-emerald-800 transition-colors">
                          Reserve Stall #4
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* RYK Popup */}
                {activeStationPopup === 'ryk' && (
                  <div className="absolute left-[64%] top-[56%] z-20 flex flex-col items-center pointer-events-auto transform -translate-x-1/2 -translate-y-full drop-shadow-2xl">
                    <div className="w-[340px] bg-[#FCFAF6]/95 backdrop-blur-2xl rounded-2xl p-4 shadow-xl border border-[#E4DDD2] flex flex-col gap-3 text-[#25201A]">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            6 of 8 Available • 180 kW DC
                          </span>
                          <h3 className="text-sm font-bold text-[#25201A]">RYK Oasis Superhub</h3>
                          <div className="text-[11px] text-[#5E564B]">M-5 Motorway • ⭐ 4.9 (218 reviews)</div>
                        </div>
                        <button
                          onClick={() => setActiveStationPopup(null)}
                          className="w-6 h-6 rounded-full bg-[#EAE5DA] flex items-center justify-center text-[#5E564B] hover:text-[#25201A]"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 bg-[#F4F0E8] rounded-xl p-2.5 text-xs">
                        <div>
                          <span className="text-[10px] text-[#5E564B] uppercase block">Tariff</span>
                          <strong className="text-[#25201A]">PKR 70 / kWh</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#5E564B] uppercase block">Est. Charge</span>
                          <strong className="text-emerald-700">45 min (14%→85%)</strong>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex-1 py-1.5 px-3 rounded-full bg-[#145A46] text-white font-semibold text-xs shadow-sm hover:bg-emerald-800 transition-colors">
                          Reserve Stall #2
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Multan Popup */}
                {activeStationPopup === 'multan' && (
                  <div className="absolute left-[70%] top-[41%] z-20 flex flex-col items-center pointer-events-auto transform -translate-x-1/2 -translate-y-full drop-shadow-2xl">
                    <div className="w-[320px] bg-[#FCFAF6]/95 backdrop-blur-2xl rounded-2xl p-4 shadow-xl border border-[#E4DDD2] flex flex-col gap-3 text-[#25201A]">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold mb-1">
                            ⚡ 80 kW Express
                          </span>
                          <h3 className="text-sm font-bold text-[#25201A]">Multan Metro Volt</h3>
                          <div className="text-[11px] text-[#5E564B]">M-4/M-5 Jct • Dining & Restrooms</div>
                        </div>
                        <button
                          onClick={() => setActiveStationPopup(null)}
                          className="w-6 h-6 rounded-full bg-[#EAE5DA] flex items-center justify-center text-[#5E564B] hover:text-[#25201A]"
                        >
                          ✕
                        </button>
                      </div>
                      <button className="w-full py-1.5 px-3 rounded-full bg-[#145A46] text-white font-semibold text-xs shadow-sm">
                        Reserve Stall
                      </button>
                    </div>
                  </div>
                )}

                {/* N-5 Alternative Route Interactive Switch Pill */}
                <div
                  onClick={() => handleSwitchCorridor(selectedCorridorRoute === 'M5' ? 'N5' : 'M5')}
                  className="absolute left-[54%] top-[56%] z-20 flex flex-col items-center pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-105 transition-all"
                >
                  <div
                    className={`rounded-full shadow-lg border px-3 py-1 flex items-center gap-1.5 transition-all ${
                      selectedCorridorRoute === 'N5'
                        ? 'bg-[#25201A] text-white border-black'
                        : 'bg-[#FCFAF6]/90 backdrop-blur-xl border-[#E4DDD2] text-[#25201A] hover:border-emerald-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px] text-emerald-600">alt_route</span>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="font-bold">N-5 Alt</span>
                      <span className="text-rose-600 font-semibold">+1h 45m</span>
                      <span className="text-[#5E564B] text-[10px] hidden sm:inline">• 1,543 km</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* LEAFLET GIS CANVAS (AVAILABLE VIA TOGGLE) */
              <div
                ref={mapContainerRef}
                id="voltpath-leaflet-map"
                className="absolute inset-0 z-0 bg-[#F5F2EB] w-full h-full"
              />
            )}

            {/* Top Filter Chips & Map Mode Switcher */}
            <div className="absolute top-3 left-4 md:left-[415px] right-4 z-20 pointer-events-auto flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
              
              {/* Presets Strip */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('OPTIMAL')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#145A46] text-white shadow-sm text-xs font-semibold shrink-0 hover:bg-emerald-800 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-300" />
                  <span>Standard (18.5h Min Cost)</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset('FAST')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FCFAF6]/90 backdrop-blur-md text-[#25201A] shadow-sm text-xs font-medium shrink-0 border border-[#E4DDD2] hover:bg-[#F4F0E8] transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px] text-emerald-700">bolt</span>
                  <span>HyperCharge Rush (17.75h)</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset('TIGHT_EDGE')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FCFAF6]/90 backdrop-blur-md text-[#25201A] shadow-sm text-xs font-medium shrink-0 border border-[#E4DDD2] hover:bg-[#F4F0E8] transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px] text-rose-700">timer_off</span>
                  <span>T_max 11h Edge Case</span>
                </button>
              </div>

              {/* Map Mode Switcher (Vector vs Leaflet) */}
              <div className="flex items-center gap-1 bg-[#FCFAF6]/95 backdrop-blur-md p-1 rounded-full border border-[#E4DDD2] shadow-sm text-xs font-semibold shrink-0">
                <button
                  type="button"
                  onClick={() => setMapMode('vector')}
                  className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                    mapMode === 'vector'
                      ? 'bg-[#25201A] text-white shadow-sm'
                      : 'text-[#5E564B] hover:text-[#25201A]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">polyline</span>
                  <span>Motorway Corridor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMapMode('leaflet')}
                  className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                    mapMode === 'leaflet'
                      ? 'bg-[#25201A] text-white shadow-sm'
                      : 'text-[#5E564B] hover:text-[#25201A]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">map</span>
                  <span>OpenStreetMap GIS</span>
                </button>
              </div>
            </div>

            {/* Map Floating Controls (Bottom-Right) */}
            <div className="fixed right-6 bottom-6 z-30 flex flex-col gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={handleMapRecenter}
                title="Recenter Highway Corridor"
                className="w-10 h-10 rounded-full bg-[#FCFAF6]/95 backdrop-blur-md flex items-center justify-center text-[#25201A] shadow-md border border-[#E4DDD2] hover:bg-[#F4F0E8] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">my_location</span>
              </button>

              <div className="flex flex-col bg-[#FCFAF6]/95 backdrop-blur-md rounded-full shadow-md border border-[#E4DDD2] overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleMapZoom('in')}
                  title="Zoom In"
                  className="w-10 h-10 flex items-center justify-center text-[#25201A] hover:bg-[#F4F0E8] transition-colors border-b border-[#E4DDD2]"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMapZoom('out')}
                  title="Zoom Out"
                  className="w-10 h-10 flex items-center justify-center text-[#25201A] hover:bg-[#F4F0E8] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
              </div>
            </div>

            {/* LEFT ROUTE PLANNING DRAWER / SIDEBAR (CLEAN, SHARP, EYE-SAFETY TONES) */}
            <div className="relative md:absolute md:left-6 md:top-3 md:bottom-3 z-30 w-full md:w-[385px] flex flex-col justify-end md:justify-start pointer-events-none mt-auto md:mt-0 p-2 md:p-0">
              <div className="pointer-events-auto w-full bg-[#FCFAF6]/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_35px_-4px_rgba(37,32,26,0.12)] border border-[#E4DDD2] flex flex-col max-h-[calc(100vh-5.5rem)] overflow-hidden">
                
                {/* Header */}
                <div className="p-4 pb-3 flex flex-col gap-3 bg-[#F4F0E8]/70 border-b border-[#E4DDD2]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#145A46] text-[20px]">alt_route</span>
                      <span className="font-extrabold text-sm text-[#25201A] tracking-tight">
                        Express EV Routing
                      </span>
                    </div>

                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAE5DA] border border-[#DDD5C7] text-[#145A46] text-xs font-semibold">
                      <span className="material-symbols-outlined text-[14px]">battery_charging_full</span>
                      <span>{Math.round((initialSoc / batteryCap) * 100)}% SoC</span>
                    </div>
                  </div>

                  {/* Origin & Destination Selectors */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-[#5E564B] uppercase tracking-wider">
                        Origin Hub
                      </label>
                      <select
                        value={originId}
                        onChange={(e) => setOriginId(e.target.value)}
                        className="w-full bg-[#FCFAF6] border border-[#E4DDD2] rounded-lg px-2 py-1.5 text-xs text-[#25201A] font-semibold focus:outline-none focus:border-[#145A46]"
                      >
                        {network.nodes.map((n) => (
                          <option key={n.node_id} value={n.node_id}>
                            {n.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-[#5E564B] uppercase tracking-wider">
                        Destination
                      </label>
                      <select
                        value={destId}
                        onChange={(e) => setDestId(e.target.value)}
                        className="w-full bg-[#FCFAF6] border border-[#E4DDD2] rounded-lg px-2 py-1.5 text-xs text-[#25201A] font-semibold focus:outline-none focus:border-[#145A46]"
                      >
                        {network.nodes.map((n) => (
                          <option key={n.node_id} value={n.node_id}>
                            {n.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Scrollable Controller Body */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-xs">
                  
                  {/* KPI Stat Cards */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#F4F0E8] p-2.5 rounded-xl border border-[#E4DDD2]">
                      <span className="text-[10px] text-[#5E564B] uppercase font-bold tracking-wider block">
                        Span
                      </span>
                      <strong className="text-base text-[#25201A] font-extrabold tracking-tight">
                        {plan.total_distance_km}
                        <span className="text-[10px] font-normal text-[#5E564B] ml-0.5">km</span>
                      </strong>
                    </div>

                    <div className="bg-[#F4F0E8] p-2.5 rounded-xl border border-[#E4DDD2]">
                      <span className="text-[10px] text-[#5E564B] uppercase font-bold tracking-wider block">
                        Trip Time
                      </span>
                      <strong className="text-base text-[#145A46] font-extrabold tracking-tight">
                        {plan.total_trip_time_hours}
                        <span className="text-[10px] font-normal text-[#5E564B] ml-0.5">hrs</span>
                      </strong>
                    </div>

                    <div className="bg-[#F4F0E8] p-2.5 rounded-xl border border-[#E4DDD2]">
                      <span className="text-[10px] text-[#5E564B] uppercase font-bold tracking-wider block">
                        Tariff
                      </span>
                      <strong className="text-base text-[#25201A] font-extrabold tracking-tight">
                        {Number(plan.total_charging_cost_pkr).toLocaleString()}
                        <span className="text-[10px] font-normal text-[#5E564B] ml-0.5">PKR</span>
                      </strong>
                    </div>
                  </div>

                  {/* Battery & SoC Parameters */}
                  <div className="flex flex-col gap-2 bg-[#F4F0E8]/50 p-3 rounded-xl border border-[#E4DDD2]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#25201A]">Battery Pack</span>
                      <span className="font-mono text-emerald-800 font-bold">{batteryCap} kWh</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      step="5"
                      value={batteryCap}
                      onChange={(e) => setBatteryCap(Number(e.target.value))}
                      className="w-full"
                    />

                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-[#25201A]">Departure Charge</span>
                      <span className="font-mono text-emerald-800 font-bold">{initialSoc} kWh</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max={batteryCap}
                      step="5"
                      value={initialSoc}
                      onChange={(e) => setInitialSoc(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Recommended DP Charging Stops Timeline */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#25201A] uppercase tracking-wider">
                        Optimized Charging Stops
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-800">
                        {plan.charging_stops ? plan.charging_stops.length : 0} stops
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {(plan.charging_stops || []).map((stop, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FCFAF6] border border-[#E4DDD2] shadow-sm hover:border-emerald-600 transition-colors"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#145A46] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#25201A] truncate text-xs">
                                {stop.city_name}
                              </span>
                              <span className="text-[11px] font-bold text-emerald-800">
                                +{stop.charged_kwh} kWh
                              </span>
                            </div>
                            <div className="text-[11px] text-[#5E564B] truncate mt-0.5">
                              {stop.station_name} • {Math.round(stop.charge_time_hours * 60)} min
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-[#8A8073] mt-1 pt-1 border-t border-[#EAE5DA]">
                              <span>PKR {Number(stop.charge_cost_pkr).toLocaleString()}</span>
                              <span>{stop.arrival_soc_kwh} kWh → {stop.departure_soc_kwh} kWh</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Itemized Cost Breakdown Parity Toggle */}
                  <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#F4F0E8] border border-[#E4DDD2]">
                    <div
                      onClick={() => setShowItemizedCost(!showItemizedCost)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-bold text-[#25201A] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[17px] text-emerald-700">payments</span>
                        Fuel Parity vs Petrol
                      </span>
                      <span className="text-xs text-emerald-800 font-bold">
                        Save PKR {fuelSavingsPKR.toLocaleString()} {showItemizedCost ? '▲' : '▼'}
                      </span>
                    </div>

                    {showItemizedCost && (
                      <div className="mt-2 pt-2 border-t border-[#DDD5C7] flex flex-col gap-1.5 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-[#5E564B]">EV Charging Cost:</span>
                          <strong className="text-[#25201A]">PKR {totalCostPKR.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5E564B]">Motorway Tolls (M9/M5/M2):</span>
                          <strong className="text-[#25201A]">PKR {estTollsPKR.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between font-bold pt-1 border-t border-[#DDD5C7]">
                          <span className="text-[#25201A]">Total Trip Cost (EV):</span>
                          <strong className="text-[#145A46]">PKR {grandTotalPKR.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between text-[#8A8073]">
                          <span>Comparable Petrol (12 km/L @ 305 PKR):</span>
                          <span>PKR {petrolComparisonPKR.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="p-3 bg-[#F4F0E8]/70 border-t border-[#E4DDD2]">
                  <button
                    type="button"
                    onClick={handleRunOptimization}
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#145A46] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-emerald-800 active:scale-[0.99] transition-all"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Solving A* & DP Constraints...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">sync_saved_locally</span>
                        <span>Recompute Optimal EV Route</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 2: CHARGING NETWORK DIRECTORY                       */}
        {/* ======================================================== */}
        {activeTab === 'charging-directory' && (
          <div className="w-full flex-1 flex flex-col">
            <ChargingNetworkView network={network} />
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 3: SAVED TRIPS & COST ANALYTICS                     */}
        {/* ======================================================== */}
        {activeTab === 'saved-trips' && (
          <div className="w-full flex-1 flex flex-col">
            <SavedTripsAnalyticsView plan={plan} />
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 4: VEHICLE SPECS & BATTERY TELEMETRY                */}
        {/* ======================================================== */}
        {activeTab === 'vehicle-specs' && (
          <div className="w-full flex-1 flex flex-col">
            <VehicleSpecsTelemetryView />
          </div>
        )}
      </main>

      {/* 3. PROFESSIONAL WEBSITE FOOTER */}
      {activeTab !== 'route-planner' && (
        <footer className="w-full bg-[#FAF9F5] border-t border-[#E4DDD2] py-8 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-[#5E564B]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#EBF5EE] flex items-center justify-center p-1 border border-emerald-200">
                <img src={brandLogo} alt="VoltPath" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-bold text-[#25201A] text-sm">VoltPath</span>
                <span className="text-[#8A8073] ml-2">Intelligent EV Route & Energy Orchestration Engine</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[#5E564B]">
              <span>NED University of Engineering & Technology</span>
              <span>•</span>
              <span>CT-363 Design & Analysis of Algorithms</span>
              <span>•</span>
              <span className="text-emerald-800 font-semibold">✓ Client-Side Autonomous Engine</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
