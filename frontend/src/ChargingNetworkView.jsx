import React, { useState } from 'react'
import PixelCard from './components/PixelCard'

export default function ChargingNetworkView({ network, onSelectStation }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('ALL')
  const [viewMode, setViewMode] = useState('grid')
  const [reservedStallId, setReservedStallId] = useState(null)

  const stations = (network?.nodes || [])
    .filter((n) => n.station)
    .map((n) => ({
      ...n.station,
      city_name: n.name,
      node_id: n.node_id,
      lat: n.lat,
      lon: n.lon
    }))

  const filteredStations = stations.filter((st) => {
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !query ||
      st.name.toLowerCase().includes(query) ||
      st.city_name.toLowerCase().includes(query) ||
      st.node_id.toLowerCase().includes(query)

    if (!matchesSearch) return false

    if (selectedFilter === 'FAST') return st.power_kw >= 100
    if (selectedFilter === 'AVAILABLE') return st.is_available
    if (selectedFilter === 'VALUE') return st.cost_per_kwh <= 55
    return true
  })

  const avgTariff = stations.length
    ? (stations.reduce((acc, s) => acc + s.cost_per_kwh, 0) / stations.length).toFixed(1)
    : '54.2'

  const fastCount = stations.filter((s) => s.power_kw >= 100).length

  function handleReserve(stationId, stationName) {
    setReservedStallId(stationId)
    setTimeout(() => {
      setReservedStallId(null)
    }, 3000)
  }

  return (
    <div className="w-full px-4 lg:px-8 py-8 max-w-7xl mx-auto flex flex-col gap-6 text-[#25201A] font-sans">
      
      {/* 1. HERO CONTEXT BANNER (MINIMAL, EXECUTIVE, WARM COFFEE PALETTE) */}
      <div className="relative w-full rounded-2xl bg-[#FCFAF6] p-6 sm:p-8 shadow-sm border border-[#E4DDD2] overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="relative z-10 flex flex-col max-w-2xl">
          <div className="flex items-center gap-2 text-[#145A46] text-xs font-bold uppercase tracking-wider mb-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Corridor Live Intelligence • 1,505 km Motorway Spine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#25201A] tracking-tight">
            Charging Network Directory
          </h1>
          <p className="text-sm text-[#5E564B] mt-1.5 leading-relaxed">
            Real-time telemetry, stall availability, and peak DC fast-charging ports across Pakistan's national highway arteries (M-9, N-5, M-5, M-4, M-2).
          </p>
        </div>

        {/* Quick Corridor Vital Badges */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2.5 bg-[#F4F0E8] px-3.5 py-2.5 rounded-xl border border-[#E4DDD2] text-xs shadow-xs">
            <span className="material-symbols-outlined text-[#145A46] text-[20px]">verified</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#5E564B] uppercase font-bold tracking-wider font-sans">Network Status</span>
              <strong className="text-[#25201A] font-bold font-mono">100% Operational</strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-[#F4F0E8] px-3.5 py-2.5 rounded-xl border border-[#E4DDD2] text-xs shadow-xs">
            <span className="material-symbols-outlined text-[#145A46] text-[20px]">bolt</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#5E564B] uppercase font-bold tracking-wider font-sans">Grid Standard</span>
              <strong className="text-[#25201A] font-bold font-mono">400V - 800V DC</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CORRIDOR QUICK STATS STRIP (4 CLEAN MINIMAL KPI CARDS WITH HOVER LOGO SPIN) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group flex flex-col p-4 bg-[#FCFAF6] hover:bg-[#FDFBF7] rounded-xl border border-[#E4DDD2] hover:border-[#145A46] shadow-sm hover:shadow-md transition-all cursor-default">
          <div className="flex items-center justify-between text-[#5E564B]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Electrified Span</span>
            <div className="kpi-icon-badge">
              <span className="material-symbols-outlined text-[18px] text-[#145A46] kpi-icon-spin">alt_route</span>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#25201A] mt-1 font-mono">
            1,505 <span className="text-xs text-[#5E564B] font-normal font-sans">km</span>
          </div>
          <span className="text-xs text-[#5E564B] mt-0.5">Karachi to Islamabad</span>
        </div>

        <div className="group flex flex-col p-4 bg-[#FCFAF6] hover:bg-[#FDFBF7] rounded-xl border border-[#E4DDD2] hover:border-[#145A46] shadow-sm hover:shadow-md transition-all cursor-default">
          <div className="flex items-center justify-between text-[#5E564B]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Total Hubs</span>
            <div className="kpi-icon-badge">
              <span className="material-symbols-outlined text-[18px] text-[#145A46] kpi-icon-spin">ev_station</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-1 font-mono">
            <span className="text-2xl font-extrabold text-[#25201A]">{stations.length}</span>
            <span className="text-xs text-emerald-800 font-bold font-sans">• 14 Verified</span>
          </div>
          <span className="text-xs text-[#5E564B] mt-0.5">Avg interval ~107 km</span>
        </div>

        <div className="group flex flex-col p-4 bg-[#FCFAF6] hover:bg-[#FDFBF7] rounded-xl border border-[#E4DDD2] hover:border-[#145A46] shadow-sm hover:shadow-md transition-all cursor-default">
          <div className="flex items-center justify-between text-[#5E564B]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-sans">UltraFast DC Hubs</span>
            <div className="kpi-icon-badge">
              <span className="material-symbols-outlined text-[18px] text-[#145A46] kpi-icon-spin">flash_on</span>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#25201A] mt-1 font-mono">
            {fastCount} <span className="text-xs text-[#5E564B] font-normal font-sans">of {stations.length}</span>
          </div>
          <span className="text-xs text-[#5E564B] mt-0.5">100 kW to 150 kW Ports</span>
        </div>

        <div className="group flex flex-col p-4 bg-[#FCFAF6] hover:bg-[#FDFBF7] rounded-xl border border-[#E4DDD2] hover:border-[#145A46] shadow-sm hover:shadow-md transition-all cursor-default">
          <div className="flex items-center justify-between text-[#5E564B]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Weighted Tariff</span>
            <div className="kpi-icon-badge">
              <span className="material-symbols-outlined text-[18px] text-[#145A46] kpi-icon-spin">payments</span>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#25201A] mt-1 font-mono">
            {avgTariff} <span className="text-xs text-[#5E564B] font-normal font-sans">PKR</span>
          </div>
          <span className="text-xs text-[#5E564B] mt-0.5">Average PKR/kWh rate</span>
        </div>
      </div>

      {/* 3. SEARCH & FILTER CONTROLS */}
      <div className="bg-[#FCFAF6] rounded-xl p-4 shadow-sm border border-[#E4DDD2] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full bg-[#F4F0E8] rounded-xl flex items-center px-3.5 py-2 border border-[#E4DDD2]">
          <span className="material-symbols-outlined text-[#A3998A] text-[18px] mr-2">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stations by city, highway, or hub ID (e.g., Sukkur, Multan, RYK, N06)..."
            className="w-full bg-transparent text-xs font-semibold text-[#25201A] placeholder:text-[#A3998A] outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[#5E564B] hover:text-[#25201A] text-xs font-bold ml-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills & View Mode */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedFilter === 'ALL'
                  ? 'bg-[#145A46] text-white shadow-sm'
                  : 'bg-[#F4F0E8] text-[#5E564B] hover:text-[#25201A]'
              }`}
            >
              All ({stations.length})
            </button>

            <button
              type="button"
              onClick={() => setSelectedFilter('FAST')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                selectedFilter === 'FAST'
                  ? 'bg-[#145A46] text-white shadow-sm'
                  : 'bg-[#F4F0E8] text-[#5E564B] hover:text-[#25201A]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              <span>UltraFast (100kW+)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFilter('VALUE')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedFilter === 'VALUE'
                  ? 'bg-[#145A46] text-white shadow-sm'
                  : 'bg-[#F4F0E8] text-[#5E564B] hover:text-[#25201A]'
              }`}
            >
              Economical (≤ PKR 55)
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#F4F0E8] p-1 rounded-lg border border-[#E4DDD2]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid Card View"
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid' ? 'bg-[#FCFAF6] text-[#25201A] shadow-xs' : 'text-[#8A8073]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">grid_view</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('compact')}
              title="Table Audit View"
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'compact' ? 'bg-[#FCFAF6] text-[#25201A] shadow-xs' : 'text-[#8A8073]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">table_rows</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reservation Toast Notification */}
      {reservedStallId && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700 text-[18px]">check_circle</span>
            <span>Stall reserved successfully! Fast-charging slot clamped for 30 minutes.</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-800 font-bold">Slot #1 Confirmed</span>
        </div>
      )}

      {/* 4. STATION CARDS (GRID VIEW) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStations.map((st) => (
            <PixelCard
              key={st.station_id}
              variant="emerald"
              theme="light"
              radius={16}
              gap={9}
              intro={false}
              className="p-5 flex flex-col justify-between gap-4 group"
            >
              <div>
                {/* Card Header: Node ID & Power Pill */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-[#F4F0E8] text-[#5E564B] text-[10px] font-mono font-bold uppercase tracking-wider">
                    Node {st.node_id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                      st.power_kw >= 100
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-900 border border-amber-200'
                    }`}
                  >
                    ⚡ {st.power_kw} kW DC
                  </span>
                </div>

                {/* Station Name & City */}
                <h3 className="font-display font-bold text-base text-[#25201A] group-hover:text-[#145A46] transition-colors">
                  {st.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-[#5E564B] mt-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  <span>{st.city_name}</span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 bg-[#F4F0E8]/70 p-3 rounded-lg text-xs font-sans">
                  <div>
                    <span className="text-[10px] text-[#5E564B] uppercase font-bold tracking-wider block">Tariff</span>
                    <strong className="text-[#25201A] font-mono">PKR {st.cost_per_kwh}/kWh</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5E564B] uppercase font-bold tracking-wider block">Queue Delay</span>
                    <strong className="text-[#25201A] font-mono">~{Math.round((st.queue_wait_hours || 0.1) * 60)} min</strong>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        st.is_available ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600'
                      }`}
                    />
                    <span className={`text-[11px] font-semibold ${st.is_available ? 'text-emerald-800' : 'text-rose-700'}`}>
                      {st.is_available ? 'Operational • 4 Free Stalls' : 'Temporarily Offline'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8A8073]">CCS-2 / GBT</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#E4DDD2]">
                <button
                  type="button"
                  onClick={() => onSelectStation && onSelectStation(st.node_id)}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#F4F0E8] hover:bg-[#EAE5DA] text-[#25201A] text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">alt_route</span>
                  <span>Route From Here</span>
                </button>
                <button
                  type="button"
                  disabled={!st.is_available}
                  onClick={() => handleReserve(st.station_id, st.name)}
                  className="py-2 px-3 rounded-lg bg-[#145A46] hover:bg-emerald-800 disabled:bg-gray-300 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-[15px]">book_online</span>
                  <span>Reserve</span>
                </button>
              </div>
            </PixelCard>
          ))}
        </div>
      )}

      {/* 5. DENSE TABLE AUDIT VIEW */}
      {viewMode === 'compact' && (
        <div className="bg-[#FCFAF6] rounded-xl border border-[#E4DDD2] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F4F0E8] border-b border-[#E4DDD2] text-[11px] font-bold text-[#5E564B] uppercase tracking-wider font-sans">
                  <th className="py-3 px-4">Node</th>
                  <th className="py-3 px-4">Station & Corridor</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Power (kW)</th>
                  <th className="py-3 px-4">Tariff (PKR)</th>
                  <th className="py-3 px-4">Wait Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4DDD2] font-sans">
                {filteredStations.map((st) => (
                  <tr key={st.station_id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#145A46]">{st.node_id}</td>
                    <td className="py-3 px-4">
                      <strong className="text-[#25201A] block font-display">{st.name}</strong>
                      <span className="text-[10px] text-[#8A8073] font-mono">{st.station_id}</span>
                    </td>
                    <td className="py-3 px-4 text-[#5E564B] font-medium">{st.city_name}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#25201A]">{st.power_kw} kW DC</td>
                    <td className="py-3 px-4 font-mono font-semibold text-emerald-800">PKR {st.cost_per_kwh}</td>
                    <td className="py-3 px-4 font-mono text-[#5E564B]">~{Math.round((st.queue_wait_hours || 0.1) * 60)} min</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          st.is_available ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${st.is_available ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        {st.is_available ? 'Active' : 'Offline'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectStation && onSelectStation(st.node_id)}
                        className="py-1 px-2.5 rounded bg-[#145A46] text-white text-[11px] font-semibold hover:bg-emerald-800 transition-colors"
                      >
                        Route
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
