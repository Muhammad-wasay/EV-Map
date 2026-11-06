import React from 'react'

export default function HomeOverviewView({ onNavigate, plan }) {
  return (
    <div className="w-full flex flex-col font-sans text-[#25201A]">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F7F5F0] to-[#F4F0E8] border-b border-[#E4DDD2] py-16 lg:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          
          {/* Top Academic Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF5EE] border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide uppercase shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>NED University CT-363 DAA CEP • Electric Vehicle Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#25201A] tracking-tight leading-[1.15] max-w-4xl">
            Intelligent EV Route &amp;{' '}
            <span className="text-[#145A46] underline decoration-emerald-300 decoration-wavy decoration-2 underline-offset-8">
              Energy Orchestration
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-[#5E564B] max-w-2xl leading-relaxed">
            Autonomous multi-objective route planning and battery replenishment across Pakistan's 
            <strong className="text-[#25201A] font-semibold"> 1,505 km Karachi → Islamabad Supercorridor</strong>. 
            Powered by A* heuristic search and dynamic programming optimization.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('route-planner')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#145A46] text-white font-bold text-sm shadow-md hover:bg-emerald-800 hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[19px]">explore</span>
              <span>Launch Interactive Route Planner</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('charging-directory')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#FCFAF6] text-[#25201A] font-semibold text-sm border border-[#E4DDD2] shadow-sm hover:bg-[#F4F0E8] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[19px] text-[#145A46]">ev_station</span>
              <span>Explore 28 Superchargers</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('saved-trips')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#FCFAF6] text-[#25201A] font-semibold text-sm border border-[#E4DDD2] shadow-sm hover:bg-[#F4F0E8] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[19px] text-amber-700">payments</span>
              <span>Fuel Parity Analytics</span>
            </button>
          </div>

          {/* Ambient Decorative Blur */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-[600px] h-[300px] bg-emerald-200/20 blur-3xl pointer-events-none rounded-full" />
        </div>
      </section>

      {/* 2. LIVE CORRIDOR STATS STRIP */}
      <section className="w-full bg-[#FCFAF6] border-b border-[#E4DDD2] py-8 px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="flex flex-col p-4 rounded-2xl bg-[#F7F5F0] border border-[#E4DDD2] shadow-sm hover:border-emerald-600 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#8A8073] uppercase tracking-wider">Electrified Span</span>
              <span className="material-symbols-outlined text-[#145A46] text-[20px]">alt_route</span>
            </div>
            <strong className="text-2xl sm:text-3xl font-extrabold text-[#25201A] mt-2 tracking-tight">
              1,505 <span className="text-xs font-semibold text-[#8A8073]">km</span>
            </strong>
            <span className="text-xs text-[#5E564B] mt-0.5">Karachi to Islamabad (M-9, M-5, M-2)</span>
          </div>

          <div className="flex flex-col p-4 rounded-2xl bg-[#F7F5F0] border border-[#E4DDD2] shadow-sm hover:border-emerald-600 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#8A8073] uppercase tracking-wider">Fast-Charge Hubs</span>
              <span className="material-symbols-outlined text-[#145A46] text-[20px]">ev_station</span>
            </div>
            <strong className="text-2xl sm:text-3xl font-extrabold text-[#145A46] mt-2 tracking-tight">
              28 <span className="text-xs font-semibold text-[#8A8073]">Stations</span>
            </strong>
            <span className="text-xs text-[#5E564B] mt-0.5">Average spacing: 53.7 km</span>
          </div>

          <div className="flex flex-col p-4 rounded-2xl bg-[#F7F5F0] border border-[#E4DDD2] shadow-sm hover:border-emerald-600 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#8A8073] uppercase tracking-wider">Fuel Cost Savings</span>
              <span className="material-symbols-outlined text-emerald-700 text-[20px]">savings</span>
            </div>
            <strong className="text-2xl sm:text-3xl font-extrabold text-[#25201A] mt-2 tracking-tight">
              PKR 22,900+
            </strong>
            <span className="text-xs text-[#5E564B] mt-0.5">70% cheaper than petrol (305 PKR/L)</span>
          </div>

          <div className="flex flex-col p-4 rounded-2xl bg-[#F7F5F0] border border-[#E4DDD2] shadow-sm hover:border-emerald-600 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#8A8073] uppercase tracking-wider">Optimal Journey Time</span>
              <span className="material-symbols-outlined text-[#145A46] text-[20px]">timer</span>
            </div>
            <strong className="text-2xl sm:text-3xl font-extrabold text-[#145A46] mt-2 tracking-tight">
              18.5 <span className="text-xs font-semibold text-[#8A8073]">hours</span>
            </strong>
            <span className="text-xs text-[#5E564B] mt-0.5">Including 5 optimized charge sessions</span>
          </div>

        </div>
      </section>

      {/* 3. PLATFORM CORE MODULES (4 INTERACTIVE CARDS) */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-12 bg-[#F7F5F0]">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-bold text-[#145A46] uppercase tracking-wider mb-1">
              Engineered Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#25201A] tracking-tight">
              Four Specialized Intelligence Modules
            </h2>
            <p className="text-sm text-[#5E564B] max-w-lg mt-2">
              Everything required to plan, optimize, and analyze long-range electric transit across Pakistan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Module 1: Route Planner */}
            <div 
              onClick={() => onNavigate('route-planner')}
              className="group flex flex-col justify-between p-6 rounded-3xl bg-[#FCFAF6] border border-[#E4DDD2] shadow-sm hover:shadow-md hover:border-[#145A46] transition-all cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#EBF5EE] text-[#145A46] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">map</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-[#25201A]">Interactive Route Planner</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">LIVE MAP</span>
                </div>
                <p className="text-xs text-[#5E564B] leading-relaxed">
                  Dual-mode GIS (Google Maps &amp; Stylized Vector) with real-time A* route graph evaluation, 
                  step-by-step DP charging schedule, battery SoC degradation simulator, and highway closure rerouting.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EAE5DA] flex items-center justify-between text-xs font-bold text-[#145A46]">
                <span>Launch Map Planner</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Module 2: Charging Network Directory */}
            <div 
              onClick={() => onNavigate('charging-directory')}
              className="group flex flex-col justify-between p-6 rounded-3xl bg-[#FCFAF6] border border-[#E4DDD2] shadow-sm hover:shadow-md hover:border-[#145A46] transition-all cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">ev_station</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-[#25201A]">Charging Network Directory</h3>
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">28 HUBS</span>
                </div>
                <p className="text-xs text-[#5E564B] leading-relaxed">
                  Comprehensive telemetry database across M-9, N-5, M-5, M-4, and M-2. Inspect DC fast charger wattages 
                  (40kW to 180kW), live stall occupancy, off-peak electricity tariffs, and roadside amenities.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EAE5DA] flex items-center justify-between text-xs font-bold text-sky-800">
                <span>Browse Station Directory</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Module 3: Saved Trips & Cost Analytics */}
            <div 
              onClick={() => onNavigate('saved-trips')}
              className="group flex flex-col justify-between p-6 rounded-3xl bg-[#FCFAF6] border border-[#E4DDD2] shadow-sm hover:shadow-md hover:border-[#145A46] transition-all cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">analytics</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-[#25201A]">Saved Trips &amp; Cost Analytics</h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">ECONOMICS</span>
                </div>
                <p className="text-xs text-[#5E564B] leading-relaxed">
                  Financial parity benchmark comparing EV charging against ICE petrol consumption. View historical 
                  expeditions, toll fee allocations, carbon emission savings, and downloadable PDF trip itineraries.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EAE5DA] flex items-center justify-between text-xs font-bold text-amber-800">
                <span>View Financial Analytics</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Module 4: Vehicle Specs & Telemetry */}
            <div 
              onClick={() => onNavigate('vehicle-specs')}
              className="group flex flex-col justify-between p-6 rounded-3xl bg-[#FCFAF6] border border-[#E4DDD2] shadow-sm hover:shadow-md hover:border-[#145A46] transition-all cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">battery_charging_full</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-[#25201A]">Vehicle Specs &amp; Telemetry</h3>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">HARDWARE</span>
                </div>
                <p className="text-xs text-[#5E564B] leading-relaxed">
                  Configurable EV hardware profiles (Tesla Model 3 Highland, BYD Seal, MG ZS EV). Test temperature 
                  coefficients (-15% in winter), C-rate charging taper curves, and usable reserve thresholds.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EAE5DA] flex items-center justify-between text-xs font-bold text-purple-800">
                <span>Adjust Vehicle Telemetry</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. THE 4-PHASE PAKISTAN MOTORWAY JOURNEY */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-12 bg-[#FCFAF6] border-y border-[#E4DDD2]">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-bold text-[#145A46] uppercase tracking-wider mb-1">Corridor Breakdown</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#25201A] tracking-tight">
              Karachi to Islamabad in 4 Transit Stages
            </h2>
            <p className="text-sm text-[#5E564B] max-w-lg mt-2">
              How the VoltPath algorithms partition the 1,505 km motorway journey for safety and efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#E4DDD2] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded-full">Phase 1 • 160 km</span>
                <h4 className="font-bold text-base text-[#25201A] mt-2">Karachi → Hyderabad</h4>
                <div className="text-xs font-semibold text-[#145A46] mt-0.5">M-9 Motorway • 100 km/h</div>
                <p className="text-xs text-[#5E564B] mt-2 leading-relaxed">
                  Initial departure stage. PSO ElectroCharge Hyderabad provides rapid top-up before transitioning onto the southern arterial roads.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-[#EAE5DA] text-[11px] text-[#8A8073]">
                Est. Battery Drain: ~29 kWh
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#E4DDD2] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded-full">Phase 2 • 345 km</span>
                <h4 className="font-bold text-base text-[#25201A] mt-2">Hyderabad → Sukkur</h4>
                <div className="text-xs font-semibold text-[#145A46] mt-0.5">N-5 Highway &amp; Moro Jct</div>
                <p className="text-xs text-[#5E564B] mt-2 leading-relaxed">
                  Moro HyperCharge Hub (150kW) and Nawabshah AC fast points ensure smooth transit past the Dadu flood bypass corridor.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-[#EAE5DA] text-[11px] text-[#8A8073]">
                Recommended Stop: Moro (30 min)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#E4DDD2] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded-full">Phase 3 • 392 km</span>
                <h4 className="font-bold text-base text-[#25201A] mt-2">Sukkur → Multan</h4>
                <div className="text-xs font-semibold text-[#145A46] mt-0.5">M-5 Motorway • 115 km/h</div>
                <p className="text-xs text-[#5E564B] mt-2 leading-relaxed">
                  Smooth 6-lane motorway corridor. RYK Oasis Superhub (180kW) provides high-throughput ultra-fast replenishment under 45 minutes.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-[#EAE5DA] text-[11px] text-[#8A8073]">
                Recommended Stop: RYK Oasis (45 min)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#E4DDD2] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded-full">Phase 4 • 608 km</span>
                <h4 className="font-bold text-base text-[#25201A] mt-2">Multan → Islamabad</h4>
                <div className="text-xs font-semibold text-[#145A46] mt-0.5">M-4 &amp; M-2 Salt Range</div>
                <p className="text-xs text-[#5E564B] mt-2 leading-relaxed">
                  Final expedition leg through Faisalabad and the Bhera Salt Range service area, arriving at Islamabad Blue Area EV Plaza with &gt;12 kWh safety reserve.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-[#EAE5DA] text-[11px] text-[#8A8073]">
                Arrival State: 16% Buffer Reserve
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. DAA CEP ALGORITHM ARCHITECTURE SHOWCASE */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-12 bg-[#F7F5F0]">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-bold text-[#145A46] uppercase tracking-wider mb-1">
              Design &amp; Analysis of Algorithms
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#25201A] tracking-tight">
              Algorithmic Core (CT-363 CEP)
            </h2>
            <p className="text-sm text-[#5E564B] max-w-lg mt-2">
              Rigorous computational techniques solving NP-hard constrained optimization in polynomial time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-[#E4DDD2] shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">
                A*
              </div>
              <h4 className="font-bold text-sm text-[#25201A]">A* Heuristic Graph Search</h4>
              <p className="text-xs text-[#5E564B] mt-2 leading-relaxed">
                Evaluates <code className="bg-[#F4F0E8] px-1 py-0.5 rounded text-[11px]">f(n) = g(n) + h(n)</code> where 
                <code className="bg-[#F4F0E8] px-1 py-0.5 rounded text-[11px]">h(n)</code> is the admissible Haversine great-circle distance. 
                Optimizes travel time while avoiding flooded edges.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-[#E4DDD2] shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm mb-3">
                DP
              </div>
              <h4 className="font-bold text-sm text-[#25201A]">Bellman-Ford Dynamic Prog.</h4>
              <p className="text-xs text-[#5E564B] mt-2 leading-relaxed">
                Multi-stage recurrence with state discretization (<code className="bg-[#F4F0E8] px-1 py-0.5 rounded text-[11px]">B = 64</code> levels). 
                Minimizes total charging cost while strictly enforcing the maximum trip time constraint <code className="bg-[#F4F0E8] px-1 py-0.5 rounded text-[11px]">T_max</code>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-[#E4DDD2] shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-3">
                INC
              </div>
              <h4 className="font-bold text-sm text-[#25201A]">Incremental Graph Maintenance</h4>
              <p className="text-xs text-[#5E564B] mt-2 leading-relaxed">
                When sudden landslides or highway closures occur, performs a local branch repair starting from the divergence node, saving 
                <strong className="text-[#25201A]"> 15.4% expanded nodes</strong> over full recomputation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-[#E4DDD2] shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-sm mb-3">
                RCA
              </div>
              <h4 className="font-bold text-sm text-[#25201A]">Fail-Safe Diagnostic Engine</h4>
              <p className="text-xs text-[#5E564B] mt-2 leading-relaxed">
                Detects range dead-zones (battery capacity &lt; distance between consecutive stations), isolated disconnected nodes, 
                and provides minimum-time feasible fallback plans for over-constrained time budgets.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION BANNER */}
      <section className="w-full bg-[#145A46] text-white py-12 px-4 sm:px-6 lg:px-12 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
            Ready to simulate your journey?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Experience Pakistan's Most Advanced EV Intelligence Platform
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
            Test custom origin/destination pairs, simulate highway closures, evaluate fuel savings, and inspect charging speeds in real-time.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('route-planner')}
            className="mt-4 px-8 py-3.5 rounded-full bg-white text-[#145A46] font-extrabold text-sm shadow-lg hover:bg-emerald-50 hover:shadow-xl active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">explore</span>
            <span>Launch Route Planner Now</span>
          </button>
        </div>
      </section>

    </div>
  )
}
