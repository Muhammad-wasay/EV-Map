import React from 'react'

export default function SavedTripsAnalyticsView({ plan, onLoadTrip }) {
  const tripDistance = plan?.total_distance_km || 1505
  const chargingCostPKR = Number(plan?.total_charging_cost_pkr || 11012)
  const tollFastTagPKR = 4350
  const totalEVCostPKR = chargingCostPKR + tollFastTagPKR
  const equivalentPetrolPKR = Math.round(tripDistance * 0.08 * 275) // 8L/100km @ PKR 275/L
  const netSavingsPKR = Math.max(0, equivalentPetrolPKR - totalEVCostPKR)
  const co2OffsetMT = (tripDistance * 0.00018).toFixed(2)

  const recentTrips = [
    {
      id: 'TRIP-9021',
      date: 'Live Calculation',
      route: `${plan?.origin_name || 'Karachi (Start Hub)'} → ${plan?.destination_name || 'Islamabad (Zero Point)'}`,
      originId: plan?.route_node_ids?.[0] || 'N01',
      destId: plan?.route_node_ids?.[plan?.route_node_ids?.length - 1] || 'N14',
      corridor: 'M-9 → M-5 → M-4 → M-2 Supercorridor',
      dist: `${tripDistance} km`,
      duration: `${plan?.total_trip_time_hours || 18.5} hrs`,
      stops: `${plan?.charging_stops?.length || 5} Charging Hubs`,
      cost: `PKR ${chargingCostPKR.toLocaleString()}`,
      savings: `PKR ${netSavingsPKR.toLocaleString()}`,
      status: 'Active Plan'
    },
    {
      id: 'TRIP-8840',
      date: '28 Oct 2025',
      route: 'Lahore (M-2 / M-3 Ravi Hub) → Islamabad (Zero Point Destination)',
      originId: 'N12',
      destId: 'N14',
      corridor: 'M-2 Salt Range Motorway Express',
      dist: '345 km',
      duration: '4h 15m',
      stops: '1 Hub (Bhera M-2)',
      cost: 'PKR 2,450',
      savings: 'PKR 6,800',
      status: 'Completed'
    },
    {
      id: 'TRIP-7622',
      date: '14 Oct 2025',
      route: 'Multan (M-4 / M-5 Junction) → Faisalabad (M-3 / M-4 Hub)',
      originId: 'N09',
      destId: 'N11',
      corridor: 'M-4 Motorway Direct Link',
      dist: '240 km',
      duration: '2h 35m',
      stops: 'Direct (No Stops)',
      cost: 'PKR 0',
      savings: 'PKR 5,120',
      status: 'Completed'
    },
    {
      id: 'TRIP-6419',
      date: '02 Oct 2025',
      route: 'Karachi (Start Hub) → Hyderabad (M-9 Interchange)',
      originId: 'N01',
      destId: 'N02',
      corridor: 'M-9 Superhighway Corridor',
      dist: '160 km',
      duration: '1h 45m',
      stops: 'Direct (No Stops)',
      cost: 'PKR 0',
      savings: 'PKR 3,520',
      status: 'Completed'
    }
  ]

  return (
    <div className="w-full px-4 lg:px-8 py-8 max-w-7xl mx-auto flex flex-col gap-6 text-[#25201A] font-sans">
      
      {/* 1. HERO HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#145A46] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Economic Fleet Telemetry & Historical Audits</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#25201A] tracking-tight mt-1">
            Saved Trips & Cost Analytics
          </h1>
          <p className="text-sm text-[#5E564B] mt-1 max-w-2xl leading-relaxed">
            Comparative macroeconomic fuel parity, automated M-Tag toll tracking, and carbon abatement metrics across Pakistan's motorway corridors.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#FCFAF6] px-3.5 py-2 rounded-xl border border-[#E4DDD2] text-xs font-mono text-[#5E564B] shadow-xs">
          <span>Benchmarked vs Petrol:</span>
          <strong className="text-[#25201A]">PKR 275 / Liter</strong>
        </div>
      </div>

      {/* 2. TOP 4 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FCFAF6] rounded-xl p-5 shadow-sm border border-[#E4DDD2] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E564B] block font-sans">
              Net Fuel Savings
            </span>
            <div className="text-2xl font-extrabold text-[#145A46] tracking-tight mt-1 font-mono">
              PKR {netSavingsPKR.toLocaleString()}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E4DDD2] flex items-center justify-between text-xs">
            <span className="text-[#5E564B]">vs Equivalent Petrol</span>
            <span className="text-[#145A46] font-bold font-mono">60% Cheaper</span>
          </div>
        </div>

        <div className="bg-[#FCFAF6] rounded-xl p-5 shadow-sm border border-[#E4DDD2] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E564B] block font-sans">
              Running Cost per KM
            </span>
            <div className="text-2xl font-extrabold text-[#25201A] tracking-tight mt-1 font-mono">
              PKR {(chargingCostPKR / tripDistance).toFixed(2)}{' '}
              <span className="text-xs font-normal text-[#5E564B] font-sans">/ km</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E4DDD2] flex items-center justify-between text-xs">
            <span className="text-[#5E564B]">ICE Sedan: PKR 24.5/km</span>
            <span className="text-[#145A46] font-bold font-mono">PKR 17.2 saved/km</span>
          </div>
        </div>

        <div className="bg-[#FCFAF6] rounded-xl p-5 shadow-sm border border-[#E4DDD2] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E564B] block font-sans">
              CO₂ Emissions Offset
            </span>
            <div className="text-2xl font-extrabold text-[#145A46] tracking-tight mt-1 font-mono">
              {co2OffsetMT} <span className="text-xs font-normal text-[#5E564B] font-sans">Metric Tons</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E4DDD2] flex items-center justify-between text-xs">
            <span className="text-[#5E564B]">Tailpipe GHGs</span>
            <span className="text-[#145A46] font-bold">Zero Exhaust</span>
          </div>
        </div>

        <div className="bg-[#FCFAF6] rounded-xl p-5 shadow-sm border border-[#E4DDD2] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E564B] block font-sans">
              M-Tag Highway Tolls
            </span>
            <div className="text-2xl font-extrabold text-[#25201A] tracking-tight mt-1 font-mono">
              PKR {tollFastTagPKR.toLocaleString()}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E4DDD2] flex items-center justify-between text-xs">
            <span className="text-[#5E564B]">M-9, M-5, M-4, M-2</span>
            <span className="text-emerald-800 font-bold">Fast-Track Pass</span>
          </div>
        </div>
      </div>

      {/* 3. MACROECONOMIC FUEL PARITY VISUAL COMPARISON */}
      <div className="bg-[#FCFAF6] rounded-xl p-6 border border-[#E4DDD2] shadow-sm flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display font-bold text-lg text-[#25201A]">
              Corridor Economic Parity Breakdown (Karachi → Islamabad)
            </h2>
            <p className="text-xs text-[#5E564B] mt-0.5">
              Direct cost comparison over {tripDistance} km transit including fuel/charging tariffs and motorway tolls.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono font-bold">
            Total Saved: PKR {netSavingsPKR.toLocaleString()}
          </span>
        </div>

        {/* Visual Comparison Bars */}
        <div className="flex flex-col gap-3 font-sans text-xs">
          {/* Petrol Vehicle */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-[#5E564B]">Traditional Petrol Sedan (8.0L / 100km @ PKR 275/L)</span>
              <strong className="font-mono text-[#25201A]">PKR {equivalentPetrolPKR.toLocaleString()}</strong>
            </div>
            <div className="w-full bg-[#EAE5DA] h-3 rounded-full overflow-hidden">
              <div className="bg-rose-600 h-full rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          {/* VoltPath Electric Vehicle */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-[#145A46]">VoltPath Optimized EV Journey (Charging + Motorway Tolls)</span>
              <strong className="font-mono text-[#145A46]">PKR {totalEVCostPKR.toLocaleString()}</strong>
            </div>
            <div className="w-full bg-[#EAE5DA] h-3 rounded-full overflow-hidden flex">
              <div
                className="bg-[#145A46] h-full"
                style={{ width: `${(chargingCostPKR / equivalentPetrolPKR) * 100}%` }}
                title="Charging Cost"
              />
              <div
                className="bg-amber-600 h-full"
                style={{ width: `${(tollFastTagPKR / equivalentPetrolPKR) * 100}%` }}
                title="M-Tag Highway Tolls"
              />
            </div>
            <div className="flex items-center gap-4 text-[10px] text-[#5E564B] mt-1.5 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#145A46]" />
                Charging Energy: PKR {chargingCostPKR.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-600" />
                M-Tag Motorway Tolls: PKR {tollFastTagPKR.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. HISTORICAL TRIPS LEDGER TABLE */}
      <div className="bg-[#FCFAF6] rounded-xl border border-[#E4DDD2] overflow-hidden shadow-sm flex flex-col">
        <div className="p-4 bg-[#F4F0E8] border-b border-[#E4DDD2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#145A46] text-[18px]">history</span>
            <h2 className="font-display font-bold text-sm text-[#25201A]">Historical Trip Audit Ledger</h2>
          </div>
          <span className="text-xs text-[#5E564B] font-mono">{recentTrips.length} Logged Runs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FCFAF6] border-b border-[#E4DDD2] text-[11px] font-bold text-[#5E564B] uppercase tracking-wider font-sans">
                <th className="py-3 px-4">Trip ID &amp; Date</th>
                <th className="py-3 px-4">Highway Route &amp; Corridor</th>
                <th className="py-3 px-4 font-mono">Distance</th>
                <th className="py-3 px-4 font-mono">Duration</th>
                <th className="py-3 px-4">Charging Stops</th>
                <th className="py-3 px-4 font-mono">Tariff Cost</th>
                <th className="py-3 px-4 font-mono">Net Savings</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4DDD2] font-sans">
              {recentTrips.map((t) => (
                <tr key={t.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 px-4">
                    <strong className="text-[#145A46] font-mono block">{t.id}</strong>
                    <span className="text-[10px] text-[#8A8073]">{t.date}</span>
                  </td>
                  <td className="py-3 px-4">
                    <strong className="text-[#25201A] block font-display">{t.route}</strong>
                    <span className="text-[10px] text-[#5E564B]">{t.corridor}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#25201A]">{t.dist}</td>
                  <td className="py-3 px-4 font-mono text-[#5E564B]">{t.duration}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#F4F0E8] text-[#25201A] text-[11px] font-medium">
                      {t.stops}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#25201A]">{t.cost}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800">{t.savings}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onLoadTrip && onLoadTrip(t.originId, t.destId)}
                      className="py-1 px-2.5 rounded bg-[#145A46] text-white text-[11px] font-semibold hover:bg-emerald-800 transition-colors shadow-xs"
                    >
                      Load Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
