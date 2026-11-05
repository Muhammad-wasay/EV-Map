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
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Economic Fleet Telemetry &amp; Historical Logs
        </span>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight mt-0.5">
          Saved Trips &amp; Cost Analytics
        </h1>
        <p className="text-sm text-outline mt-1 max-w-2xl">
          Comparative macroeconomic fuel parity, CO2 reduction metrics, and automated Fast-Tag motorway toll auditing.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
              Cumulative Fuel Savings
            </span>
            <div className="text-2xl font-extrabold text-primary tracking-tight mt-1">
              PKR {netSavingsPKR.toLocaleString()}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <span className="text-outline">vs Equivalent ICE</span>
            <span className="text-tertiary font-bold">63% Cheaper</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
              Average Energy Running Cost
            </span>
            <div className="text-2xl font-extrabold text-on-surface tracking-tight mt-1">
              PKR {(chargingCostPKR / tripDistance).toFixed(2)}{' '}
              <span className="text-xs font-normal text-outline">/ km</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <span className="text-outline">ICE Petrol: PKR 24.5/km</span>
            <span className="text-primary font-bold">17.2 saved/km</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
              CO2 Emissions Offset
            </span>
            <div className="text-2xl font-extrabold text-tertiary tracking-tight mt-1">
              {co2OffsetMT} <span className="text-xs font-normal text-outline">MT</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <span className="text-outline">Clean Motorway Run</span>
            <span className="text-tertiary font-bold">142 Trees Equiv.</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
              Total Logged Highway Run
            </span>
            <div className="text-2xl font-extrabold text-secondary tracking-tight mt-1">
              2,120 <span className="text-xs font-normal text-outline">km</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <span className="text-outline">M-2 / M-4 / M-5</span>
            <span className="text-secondary font-bold">3 Trips Logged</span>
          </div>
        </div>
      </div>

      {/* Macro Cost Comparison Visual */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-4">
          <div>
            <span className="text-xs font-bold uppercase text-outline">Macro Cost Comparison</span>
            <h2 className="text-lg font-bold text-on-surface">EV Energy vs. ICE Fuel Expenditure</h2>
          </div>
          <div className="text-xs text-outline">
            National Motorway Highway Corridor (Karachi &rarr; Islamabad)
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase text-primary tracking-wider">
              ⚡ EV Supercharging
            </span>
            <span className="text-xl font-bold text-on-surface">
              PKR {chargingCostPKR.toLocaleString()}
            </span>
            <span className="text-xs text-outline">DP-Optimized Corridor Stops</span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase text-secondary tracking-wider">
              🛣️ Motorway M-Tag Tolls
            </span>
            <span className="text-xl font-bold text-on-surface">
              PKR {tollFastTagPKR.toLocaleString()}
            </span>
            <span className="text-xs text-outline">M-9, M-5, M-4, M-2 Electronic Fast-Tag</span>
          </div>

          <div className="p-3.5 rounded-xl bg-error-container/30 border border-error/20 flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase text-error tracking-wider">
              ⛽ Equivalent Petrol ICE
            </span>
            <span className="text-xl font-bold text-error">
              PKR {equivalentPetrolPKR.toLocaleString()}
            </span>
            <span className="text-xs text-outline">Based on PKR 275.0 / Liter</span>
          </div>
        </div>
      </div>

      {/* Saved Trips Table */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-on-surface">Saved Expeditions &amp; After-Action Logs</h3>
          <span className="text-xs text-outline font-semibold">3 Expeditions Synchronized</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-outline">
                <th className="py-2.5 font-bold">Trip ID</th>
                <th className="py-2.5 font-bold">Route &amp; Corridors</th>
                <th className="py-2.5 font-bold">Distance</th>
                <th className="py-2.5 font-bold">Duration</th>
                <th className="py-2.5 font-bold">DP Stops</th>
                <th className="py-2.5 font-bold">EV Cost</th>
                <th className="py-2.5 font-bold">Net Savings</th>
                <th className="py-2.5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {recentTrips.map((t) => (
                <tr key={t.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-primary">{t.id}</td>
                  <td className="py-3">
                    <strong className="text-on-surface block">{t.route}</strong>
                    <span className="text-[10px] text-outline">{t.corridor}</span>
                  </td>
                  <td className="py-3 font-semibold">{t.dist}</td>
                  <td className="py-3 font-semibold">{t.duration}</td>
                  <td className="py-3 text-tertiary font-bold">{t.stops}</td>
                  <td className="py-3 font-bold text-on-surface">{t.cost}</td>
                  <td className="py-3 text-primary font-bold">{t.savings}</td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed/30 text-on-tertiary-fixed-variant text-[10px] font-bold">
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
