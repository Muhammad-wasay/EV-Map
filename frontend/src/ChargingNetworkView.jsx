import React, { useState } from 'react'

export default function ChargingNetworkView({ network, onSelectStation }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('ALL')
  const [viewMode, setViewMode] = useState('grid')

  const stations = network.nodes
    .filter((n) => n.station)
    .map((n) => ({
      ...n.station,
      city_name: n.name,
      node_id: n.node_id,
      lat: n.lat,
      lon: n.lon
    }))

  const filteredStations = stations.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.city_name.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (selectedFilter === 'FAST') return st.power_kw >= 100
    if (selectedFilter === 'AVAILABLE') return st.is_available
    if (selectedFilter === 'VALUE') return st.cost_per_kwh <= 65
    return true
  })

  return (
    <div className="w-full px-4 lg:px-8 py-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* 1. Hero Corridor Context Bar (Stitch Design) */}
      <div className="relative w-full rounded-2xl bg-white p-6 shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="relative z-10 flex flex-col max-w-2xl">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Corridor Live Intelligence • KHI → ISB Supercorridor</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Charging Network Directory
          </h1>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Comprehensive real-time telemetry, stall occupancy, and fast-reserve slots across Pakistan's 1,505 km M-9, N-5, M-5, and M-2 motorway transit arteries.
          </p>
        </div>

        {/* Quick Corridor Vital Badges */}
        <div className="relative z-10 flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">verified</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Network Health</span>
              <strong className="text-slate-900 font-bold">100% Operational</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">flash_on</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Grid Voltage</span>
              <strong className="text-slate-900 font-bold">Stable • 400V - 800V</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Corridor Quick Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Electrified Span</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-600">alt_route</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
            1,505 <span className="text-xs text-slate-500 font-normal">km</span>
          </div>
          <span className="text-xs text-slate-500 mt-0.5">Karachi to Islamabad</span>
        </div>

        <div className="flex flex-col p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Stations</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-600">ev_station</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1 font-mono">
            <span className="text-2xl font-extrabold text-slate-900">{stations.length}</span>
            <span className="text-xs text-emerald-700 font-bold">• 100% Online</span>
          </div>
          <span className="text-xs text-slate-500 mt-0.5">Avg interval: 53.7 km</span>
        </div>

        <div className="flex flex-col p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Corridor Uptime</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-600">bolt</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
            99.4<span className="text-xs text-slate-500 font-normal">%</span>
          </div>
          <span className="text-xs text-slate-500 mt-0.5">Solar &amp; Battery Buffers</span>
        </div>

        <div className="flex flex-col p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Average Tariff</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-600">payments</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
            68.5 <span className="text-xs text-slate-500 font-normal">PKR</span>
          </div>
          <span className="text-xs text-slate-500 mt-0.5">Per kWh • Off-peak tier</span>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full bg-slate-50 rounded-xl flex items-center px-3.5 py-2 border border-slate-200">
            <span className="material-symbols-outlined text-slate-400 text-[20px] mr-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hubs by city, station name, or motorway exit (e.g. Sukkur, Multan, Moro, RYK)..."
              className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span>Hubs Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('compact')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'compact'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">view_list</span>
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              selectedFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Corridors ({stations.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('FAST')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              selectedFilter === 'FAST'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-emerald-600">bolt</span>
            <span>UltraFast 100kW+ DC</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('AVAILABLE')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              selectedFilter === 'AVAILABLE'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Available Stalls</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('VALUE')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              selectedFilter === 'VALUE'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-emerald-600">price_change</span>
            <span>Economy (&le; PKR 65/kWh)</span>
          </button>
        </div>
      </div>

      {/* 4. Stations Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStations.map((st) => (
            <article
              key={st.station_id}
              className={`bg-white rounded-xl p-5 shadow-sm hover:shadow-md border transition-all flex flex-col justify-between gap-4 ${
                st.is_available
                  ? 'border-slate-200 hover:border-emerald-500'
                  : 'border-rose-200 opacity-80'
              }`}
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                        {st.city_name} • {st.node_id}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 font-mono">
                        {st.power_kw} kW DC
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {st.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>6/8 Free</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-lg p-2.5 text-xs border border-slate-200">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Tariff</span>
                    <strong className="text-slate-900 font-mono">PKR {st.cost_per_kwh} / kWh</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Charger Type</span>
                    <strong className="text-emerald-800">CCS2 • CHAdeMO</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-600">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Tea Bar</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Restrooms</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Mosque</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">24/7 Security</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onSelectStation(st)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[15px] text-emerald-400">explore</span>
                  <span>View on Route Map</span>
                </button>

                <span className="text-[11px] font-mono text-slate-500">
                  {st.lat.toFixed(2)}°N, {st.lon.toFixed(2)}°E
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Compact Table View */
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <th className="p-3 font-bold">Node</th>
                  <th className="p-3 font-bold">Station Name</th>
                  <th className="p-3 font-bold">City</th>
                  <th className="p-3 font-bold">Power</th>
                  <th className="p-3 font-bold">Tariff</th>
                  <th className="p-3 font-bold">Stall Occupancy</th>
                  <th className="p-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStations.map((st) => (
                  <tr key={st.station_id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-emerald-800">{st.node_id}</td>
                    <td className="p-3 font-bold text-slate-900">{st.name}</td>
                    <td className="p-3 text-slate-700">{st.city_name}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{st.power_kw} kW</td>
                    <td className="p-3 font-mono text-slate-700">PKR {st.cost_per_kwh}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[10px]">
                        Available
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => onSelectStation(st)}
                        className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}