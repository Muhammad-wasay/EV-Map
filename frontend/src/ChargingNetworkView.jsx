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
    <div className="w-full px-4 lg:px-8 py-6 max-w-7xl mx-auto flex flex-col gap-6 text-[#25201A]">
      {/* 1. Hero Corridor Context Bar (Stitch Design, Warm Coffee Eye-Safety) */}
      <div className="relative w-full rounded-2xl bg-[#FCFAF6] p-6 shadow-sm border border-[#E4DDD2] overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="relative z-10 flex flex-col max-w-2xl">
          <div className="flex items-center gap-2 text-[#145A46] text-xs font-bold uppercase tracking-wider mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Corridor Live Intelligence • KHI → ISB Supercorridor</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#25201A] tracking-tight">
            Charging Network Directory
          </h1>
          <p className="text-sm text-[#5E564B] mt-1 leading-relaxed">
            Comprehensive real-time telemetry, stall occupancy, and fast-reserve slots across Pakistan's 1,505 km M-9, N-5, M-5, and M-2 motorway transit arteries.
          </p>
        </div>

        {/* Quick Corridor Vital Badges */}
        <div className="relative z-10 flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-[#F4F0E8] px-3.5 py-2 rounded-xl border border-[#E4DDD2] text-xs">
            <span className="material-symbols-outlined text-[#145A46] text-[20px]">verified</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#5E564B] uppercase font-bold">Network Health</span>
              <strong className="text-[#25201A] font-bold">100% Operational</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#F4F0E8] px-3.5 py-2 rounded-xl border border-[#E4DDD2] text-xs">
            <span className="material-symbols-outlined text-[#145A46] text-[20px]">flash_on</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#5E564B] uppercase font-bold">Grid Voltage</span>
              <strong className="text-[#25201A] font-bold">Stable • 400V - 800V</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Corridor Quick Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col p-4 bg-[#FCFAF6] rounded-xl border border-[#E4DDD2] shadow-sm">
          <div className="flex items-center justify-between text-[#5E564B]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Electrified Span</span>
            <span className="material-symbols-outlined text-[18px] text-[#145A46]">alt_route</span>
          </div>
          <div className="text-2xl font-extrabold text-[#25201A] mt-1 font-mono">
            1,505 <span className="text-xs text-[#5E564B] font-normal">km</span>
          </div>
          <span className="text-xs text-[#5E564B] mt-0.5">Karachi to Islamabad</span>
        </div>

        <div className="flex flex-col p-4 bg-[#FCFAF6] rounded-xl border border-[#E4DDD2] shadow-sm">
          <div className="flex items-center justify-between text-[#5E564B]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Stations</span>
            <span className="material-symbols-outlined text-[18px] text-[#145A46]">ev_station</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1 font-mono">
            <span className="text-2xl font-extrabold text-[#25201A]">{stations.length}</span>
            <span className="text-xs text-[#145A46] font-bold">• 100% Online</span>
          </div>
          <span className="text-xs text-[#5E564B] mt-0.5">Avg interval: 53.7 km</span>
        </div>

        <div className="flex flex-col p-4 bg-[#FCFAF6] rounded-xl border border-[#E4DDD2] shadow-sm">
          <div className="flex items-center justify-between text-[#5E564B]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Corridor Uptime</span>
            <span className="material-symbols-outlined text-[18px] text-[#145A46]">bolt</span>
          </div>
          <div className="text-2xl font-extrabold text-[#25201A] mt-1 font-mono">
            99.4<span className="text-xs text-[#5E564B] font-normal">%</span>
          </div>
          <span className="text-xs text-[#5E564B] mt-0.5">Solar &amp; Battery Buffers</span>
        </div>

        <div className="flex flex-col p-4 bg-[#FCFAF6] rounded-xl border border-[#E4DDD2] shadow-sm">
          <div className="flex items-center justify-between text-[#5E564B]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Average Tariff</span>
            <span className="material-symbols-outlined text-[18px] text-[#145A46]">payments</span>
          </div>
          <div className="text-2xl font-extrabold text-[#25201A] mt-1 font-mono">
            68.5 <span className="text-xs text-[#5E564B] font-normal">PKR</span>
          </div>
          <span className="text-xs text-[#5E564B] mt-0.5">Per kWh • Off-peak tier</span>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-[#FCFAF6] rounded-xl p-4 shadow-sm border border-[#E4DDD2] flex flex-col gap-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full bg-[#F4F0E8] rounded-xl flex items-center px-3.5 py-2 border border-[#E4DDD2]">
            <span className="material-symbols-outlined text-[#A3998A] text-[20px] mr-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hubs by city, station name, or motorway exit (e.g. Sukkur, Multan, Moro, RYK)..."
              className="w-full bg-transparent text-xs font-semibold text-[#25201A] placeholder:text-[#A3998A] outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#A3998A] hover:text-[#25201A] text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-[#F4F0E8] p-1 rounded-xl border border-[#E4DDD2]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#FCFAF6] text-[#25201A] shadow-sm'
                  : 'text-[#5E564B] hover:text-[#25201A]'
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
                  ? 'bg-[#FCFAF6] text-[#25201A] shadow-sm'
                  : 'text-[#5E564B] hover:text-[#25201A]'
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
                ? 'bg-[#25201A] text-[#FAF9F5] shadow-sm'
                : 'bg-[#F4F0E8] text-[#5E564B] hover:bg-[#EAE5DA]'
            }`}
          >
            All Corridors ({stations.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('FAST')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              selectedFilter === 'FAST'
                ? 'bg-[#25201A] text-[#FAF9F5] shadow-sm'
                : 'bg-[#F4F0E8] text-[#5E564B] hover:bg-[#EAE5DA]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-[#145A46]">bolt</span>
            <span>UltraFast 100kW+ DC</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('AVAILABLE')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              selectedFilter === 'AVAILABLE'
                ? 'bg-[#25201A] text-[#FAF9F5] shadow-sm'
                : 'bg-[#F4F0E8] text-[#5E564B] hover:bg-[#EAE5DA]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Available Stalls</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('VALUE')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              selectedFilter === 'VALUE'
                ? 'bg-[#25201A] text-[#FAF9F5] shadow-sm'
                : 'bg-[#F4F0E8] text-[#5E564B] hover:bg-[#EAE5DA]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-[#145A46]">price_change</span>
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
              className={`bg-[#FCFAF6] rounded-xl p-5 shadow-sm hover:shadow-md border transition-all flex flex-col justify-between gap-4 ${
                st.is_available
                  ? 'border-[#E4DDD2] hover:border-[#145A46]'
                  : 'border-rose-200 opacity-80'
              }`}
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold text-[#145A46] uppercase px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                        {st.city_name} • {st.node_id}
                      </span>
                      <span className="text-[10px] font-bold text-[#5E564B] font-mono">
                        {st.power_kw} kW DC
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[#25201A] leading-snug">
                      {st.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#F4F0E8] border border-[#E4DDD2] text-[#25201A] text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>6/8 Free</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-[#F4F0E8] rounded-lg p-2.5 text-xs border border-[#E4DDD2]">
                  <div>
                    <span className="text-[9px] text-[#5E564B] uppercase font-bold block">Tariff</span>
                    <strong className="text-[#25201A] font-mono">PKR {st.cost_per_kwh} / kWh</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#5E564B] uppercase font-bold block">Charger Type</span>
                    <strong className="text-[#145A46]">CCS2 • CHAdeMO</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1 text-[11px] text-[#5E564B]">
                  <span className="px-2 py-0.5 rounded bg-[#F4F0E8] text-[#5E564B]">Tea Bar</span>
                  <span className="px-2 py-0.5 rounded bg-[#F4F0E8] text-[#5E564B]">Restrooms</span>
                  <span className="px-2 py-0.5 rounded bg-[#F4F0E8] text-[#5E564B]">Mosque</span>
                  <span className="px-2 py-0.5 rounded bg-[#F4F0E8] text-[#5E564B]">24/7 Security</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E4DDD2] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onSelectStation(st)}
                  className="px-3 py-1.5 rounded-lg bg-[#25201A] hover:bg-black text-[#FAF9F5] font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[15px] text-emerald-400">explore</span>
                  <span>View on Route Map</span>
                </button>

                <span className="text-[11px] font-mono text-[#5E564B]">
                  {st.lat.toFixed(2)}°N, {st.lon.toFixed(2)}°E
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Compact Table View */
        <div className="bg-[#FCFAF6] rounded-xl shadow-sm border border-[#E4DDD2] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E4DDD2] bg-[#F4F0E8] text-[#5E564B]">
                  <th className="p-3 font-bold">Node</th>
                  <th className="p-3 font-bold">Station Name</th>
                  <th className="p-3 font-bold">City</th>
                  <th className="p-3 font-bold">Power</th>
                  <th className="p-3 font-bold">Tariff</th>
                  <th className="p-3 font-bold">Stall Occupancy</th>
                  <th className="p-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4DDD2]">
                {filteredStations.map((st) => (
                  <tr key={st.station_id} className="hover:bg-[#F4F0E8] transition-colors">
                    <td className="p-3 font-mono font-bold text-[#145A46]">{st.node_id}</td>
                    <td className="p-3 font-bold text-[#25201A]">{st.name}</td>
                    <td className="p-3 text-[#5E564B]">{st.city_name}</td>
                    <td className="p-3 font-mono font-bold text-[#25201A]">{st.power_kw} kW</td>
                    <td className="p-3 font-mono text-[#5E564B]">PKR {st.cost_per_kwh}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[#145A46] font-bold text-[10px]">
                        Available
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => onSelectStation(st)}
                        className="text-[#145A46] hover:underline font-bold"
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