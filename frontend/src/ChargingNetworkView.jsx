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
    if (selectedFilter === 'VALUE') return st.cost_per_kwh <= 50
    return true
  })

  return (
    <div className="w-full px-4 lg:px-8 py-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Pakistan Highway EV Charging Directory
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight mt-0.5">
            Superchargers &amp; Fast-DC Infrastructure
          </h1>
          <p className="text-sm text-outline mt-1 max-w-2xl">
            Real-time telemetry, stall availability, peak tariffs, and charger speeds across the M-9, M-5, M-4, and M-2 Motorway corridors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-surface-container-low px-4 py-2 rounded-2xl border border-outline-variant/30 text-xs">
            <span className="text-outline uppercase font-bold block text-[10px]">Total Hubs Online</span>
            <strong className="text-primary text-base font-bold">
              {stations.filter((s) => s.is_available).length} / {stations.length} Active
            </strong>
          </div>
        </div>
      </div>

      {/* Search & Filters Row */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full bg-surface-container-low rounded-full flex items-center px-4 py-2 border border-outline-variant/20">
            <span className="material-symbols-outlined text-outline text-[20px] mr-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hubs by city, station name, or motorway (e.g. Sukkur, Multan, Moro, M-5)..."
              className="w-full bg-transparent text-sm text-on-surface placeholder:text-outline outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-outline hover:text-on-surface text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-full border border-outline-variant/20">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'grid'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span>Grid View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('compact')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'compact'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">view_list</span>
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === 'ALL'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
            }`}
          >
            All Stations ({stations.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('FAST')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
              selectedFilter === 'FAST'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-tertiary">bolt</span>
            <span>UltraFast 100kW+ DC</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('AVAILABLE')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
              selectedFilter === 'AVAILABLE'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-tertiary" />
            <span>Available Stalls Only</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('VALUE')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
              selectedFilter === 'VALUE'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-primary">price_change</span>
            <span>Economy (&le; PKR 50/kWh)</span>
          </button>
        </div>
      </div>

      {/* Stations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.map((st) => (
          <article
            key={st.station_id}
            className={`bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-md border transition-all flex flex-col justify-between gap-4 ${
              st.is_available
                ? 'border-outline-variant/30 hover:border-primary/50'
                : 'border-error/30 opacity-75'
            }`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      st.is_available
                        ? 'bg-primary-container/20 text-primary'
                        : 'bg-error-container text-error'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">ev_station</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-outline block leading-none">
                      {st.city_name} • {st.node_id}
                    </span>
                    <h3 className="text-base font-bold text-on-surface tracking-tight mt-0.5 leading-snug">
                      {st.name}
                    </h3>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    st.is_available
                      ? 'bg-tertiary-fixed/40 text-on-tertiary-fixed-variant'
                      : 'bg-error-container text-error'
                  }`}
                >
                  {st.is_available ? '● Operational' : '✕ Offline'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-surface-container-low rounded-xl p-2.5 text-xs mt-1">
                <div>
                  <span className="text-[10px] text-outline uppercase font-bold block">Power Speed</span>
                  <strong className="text-primary text-sm font-bold">{st.power_kw} kW DC</strong>
                </div>
                <div>
                  <span className="text-[10px] text-outline uppercase font-bold block">Tariff Rate</span>
                  <strong className="text-on-surface text-sm font-bold">
                    PKR {st.cost_per_kwh}{' '}
                    <span className="text-[10px] font-normal text-outline">/kWh</span>
                  </strong>
                </div>
                <div className="col-span-2 pt-1 border-t border-outline-variant/20 text-[11px] text-outline flex items-center justify-between">
                  <span>Connectors</span>
                  <span className="font-semibold text-on-surface">CCS2 • Type 2 • GB/T</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-outline text-[11px]">
                <span className="material-symbols-outlined text-[14px]">local_cafe</span>
                <span className="material-symbols-outlined text-[14px]">mosque</span>
                <span className="material-symbols-outlined text-[14px]">wc</span>
                <span className="material-symbols-outlined text-[14px]">wifi</span>
              </div>

              <button
                type="button"
                onClick={() => onSelectStation && onSelectStation(st)}
                className="px-3 py-1.5 rounded-full bg-primary text-on-primary hover:bg-primary/90 text-xs font-semibold shadow-sm transition-all"
              >
                Inspect on Map
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
