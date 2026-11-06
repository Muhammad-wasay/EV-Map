import React from 'react'

export default function SavedTripsAnalyticsView({ plan }) {
  const tripDistance = plan.total_distance_km || 1505
  const chargingCostPKR = Number(plan.total_charging_cost_pkr || 11012)
  const tollFastTagPKR = 4350
  const totalEVCostPKR = chargingCostPKR + tollFastTagPKR
  const equivalentPetrolPKR = Math.round(tripDistance * 0.08 * 275) // 8L/100km @ PKR 275/L
  const netSavingsPKR = Math.max(0, equivalentPetrolPKR - totalEVCostPKR)
  const co2OffsetMT = (tripDistance * 0.00018).toFixed(2)

  const recentTrips = [
    {
      id: 'TRIP-9021',
      date: 'Today, Live Run',
      route: 'Karachi (N01) → Islamabad (N14)',
      corridor: 'M-9 → M-5 → M-4 → M-2',
      dist: '1,505 km',
      duration: '18h 30m',
      stops: '3 Charging Hubs',
      cost: `PKR ${chargingCostPKR.toLocaleString()}`,
      savings: `PKR ${netSavingsPKR.toLocaleString()}`,
      status: 'Active Optimal'
    },
    {
      id: 'TRIP-8840',
      date: '28 Oct 2025',
      route: 'Lahore (N12) → Islamabad (N14)',
      corridor: 'M-2 Salt Range Express',
      dist: '375 km',
      duration: '4h 15m',
      stops: '1 Hub (Bhera M-2)',
      cost: 'PKR 2,450',
      savings: 'PKR 6,800',
      status: 'Completed'
    },
    {
      id: 'TRIP-7622',
      date: '14 Oct 2025',
      route: 'Multan (N09) → Faisalabad (N11)',
      corridor: 'M-4 Motorway',
      dist: '240 km',
      duration: '2h 35m',
      stops: 'Direct (No Stop)',
      cost: 'PKR 0 (Home Charged)',
      savings: 'PKR 5,120',
      status: 'Completed'
    }
  ]

  return (
    <div className="w-full px-4 lg:px-8 py-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Economic Fleet Telemetry &amp; Historical Logs
        </span>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          Saved Trips &amp; Cost Analytics
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Comparative macroeconomic fuel parity, CO2 reduction metrics, and automated Fast-Tag motorway toll auditing.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Cumulative Fuel Savings
            </span>
            <div className="text-2xl font-extrabold text-emerald-700 tracking-tight mt-1 font-mono">
              PKR {netSavingsPKR.toLocaleString()}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">vs Equivalent ICE</span>
            <span className="text-emerald-700 font-bold">63% Cheaper</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Energy Running Cost
            </span>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 font-mono">
              PKR {(chargingCostPKR / tripDistance).toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-500">/ km</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">ICE Petrol: PKR 24.5/km</span>
            <span className="text-emerald-700 font-bold">17.2 saved/km</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              CO2 Emissions Offset
            </span>
            <div className="text-2xl font-extrabold text-emerald-700 tracking-tight mt-1 font-mono">
              {co2OffsetMT} <span className="text-xs font-normal text-slate-500">MT</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Clean Motorway Run</span>
            <span className="text-emerald-700 font-bold">142 Trees Equiv.</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Total Logged Highway Run
            </span>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 font-mono">
              2,120 <span className="text-xs font-normal text-slate-500">km</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">M-2 / M-4 / M-5</span>
            <span className="text-slate-800 font-bold">3 Trips Logged</span>
          </div>
        </div>
      </div>

      {/* Macro Cost Comparison Visual */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Corridor Economics</span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">EV Energy vs. ICE Petrol Expenditure</h2>
          </div>
          <div className="text-xs text-slate-500">
            Karachi &rarr; Islamabad Supercorridor (1,505 km)
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
              ⚡ EV Supercharging
            </span>
            <span className="text-xl font-bold text-slate-900 font-mono">
              PKR {chargingCostPKR.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">DP-Optimized 3 Motorway Hubs</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">
              🛣️ Motorway M-Tag Tolls
            </span>
            <span className="text-xl font-bold text-slate-900 font-mono">
              PKR {tollFastTagPKR.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">M-9, M-5, M-4, M-2 Electronic Fast-Tag</span>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase text-rose-700 tracking-wider">
              ⛽ Equivalent Petrol ICE
            </span>
            <span className="text-xl font-bold text-rose-700 font-mono">
              PKR {equivalentPetrolPKR.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">Based on PKR 275.0 / Liter (8L/100km)</span>
          </div>
        </div>
      </div>

      {/* Saved Trips Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Saved Expeditions &amp; After-Action Logs</h3>
          <span className="text-xs text-slate-500 font-semibold">3 Expeditions Synchronized</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                <th className="p-3 font-bold">Trip ID</th>
                <th className="p-3 font-bold">Route &amp; Corridors</th>
                <th className="p-3 font-bold">Distance</th>
                <th className="p-3 font-bold">Duration</th>
                <th className="p-3 font-bold">DP Stops</th>
                <th className="p-3 font-bold">EV Cost</th>
                <th className="p-3 font-bold">Net Savings</th>
                <th className="p-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTrips.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-emerald-800">{t.id}</td>
                  <td className="p-3">
                    <strong className="text-slate-900 block">{t.route}</strong>
                    <span className="text-[10px] text-slate-500">{t.corridor}</span>
                  </td>
                  <td className="p-3 font-semibold font-mono">{t.dist}</td>
                  <td className="p-3 font-semibold">{t.duration}</td>
                  <td className="p-3 text-emerald-700 font-bold">{t.stops}</td>
                  <td className="p-3 font-bold text-slate-900 font-mono">{t.cost}</td>
                  <td className="p-3 text-emerald-700 font-bold font-mono">{t.savings}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                      {t.status}
                    </span>
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