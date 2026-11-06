import React, { useState } from 'react'

export default function VehicleSpecsTelemetryView({
  batteryCap,
  setBatteryCap,
  initialSoc,
  setInitialSoc,
  minReserve,
  setMinReserve,
  maxTime,
  setMaxTime
}) {
  const [activeModel, setActiveModel] = useState('TESLA_M3')

  const vehicleModels = {
    TESLA_M3: {
      name: '2024 Tesla Model 3 Long Range',
      edition: 'Highland Revision AWD',
      architecture: '78.1 kWh NMC (400V)',
      capacity: 78,
      rangeReal: '485 km',
      acceptanceKW: 250,
      dragCd: '0.219 Cd',
      variance: '±0.008 V',
      cycles: '64 Cycles',
      health: '98.4% SoH',
      temp: '27.5°C Clamped',
      consumption: 0.16
    },
    BYD_SEAL: {
      name: 'BYD Seal Performance',
      edition: 'Cell-to-Body (CTB) AWD',
      architecture: '82.5 kWh Blade LFP',
      capacity: 82.5,
      rangeReal: '510 km',
      acceptanceKW: 150,
      dragCd: '0.219 Cd',
      variance: '±0.006 V',
      cycles: '42 Cycles',
      health: '99.2% SoH',
      temp: '28.1°C Optimal',
      consumption: 0.17
    },
    MG4_TROPHY: {
      name: 'MG4 EV Trophy Long Range',
      edition: 'Modular Scalable Platform',
      architecture: '64.0 kWh Rubik Battery',
      capacity: 64,
      rangeReal: '390 km',
      acceptanceKW: 135,
      dragCd: '0.279 Cd',
      variance: '±0.012 V',
      cycles: '88 Cycles',
      health: '96.8% SoH',
      temp: '29.4°C Pre-conditioned',
      consumption: 0.18
    }
  }

  const v = vehicleModels[activeModel]

  function handleSelectModel(key) {
    setActiveModel(key)
    const spec = vehicleModels[key]
    setBatteryCap(spec.capacity)
    setInitialSoc(Math.round(spec.capacity * 0.82))
  }

  return (
    <div className="w-full px-4 lg:px-8 py-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* 1. Header & Live Vehicle Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Fleet Profile &amp; CAN-Bus Telemetry
            </span>
            <span className="text-slate-300">•</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              OBD-II CAN-Bus Live
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Vehicle Specs &amp; Battery Telemetry
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Real-time battery degradation curves, peak DC fast-charge acceptance profiles, and motorway aero efficiency benchmarks across the Pakistan Motorway Network.
          </p>
        </div>

        {/* Model Switcher */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {Object.entries(vehicleModels).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelectModel(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeModel === key
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {item.name.split(' ')[1]} {item.name.split(' ')[2] || ''}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Primary Connected Vehicle Hero Card (Stitch Highland Design) */}
      <div className="w-full bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col xl:flex-row gap-6">
        <div className="flex-1 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                Primary Connected Unit
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
                {v.edition}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {v.name}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Optimized for trans-provincial transit on Pakistan M-5 (Sukkur—Multan) &amp; M-2 (Lahore—Islamabad) corridors with active dual-motor torque vectoring.
            </p>
          </div>

          {/* 6-Grid Technical Specs Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Battery Architecture</span>
              <span className="text-sm font-extrabold text-slate-900 font-mono">{v.architecture}</span>
              <span className="text-[10px] text-slate-500">Nominal 400V Pack</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Real Motorway Range</span>
              <span className="text-sm font-extrabold text-emerald-700 font-mono">{v.rangeReal}</span>
              <span className="text-[10px] text-slate-500">@ 110 km/h (Sindh 32°C)</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Peak Fast Charge</span>
              <span className="text-sm font-extrabold text-slate-900 font-mono">{v.acceptanceKW} kW</span>
              <span className="text-[10px] text-slate-500">CCS2 / Supercharger V3</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Aerodynamic Drag</span>
              <span className="text-sm font-extrabold text-slate-900 font-mono">{v.dragCd}</span>
              <span className="text-[10px] text-slate-500">Aero wheel covers</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Cell Voltage Variance</span>
              <span className="text-sm font-extrabold text-emerald-700 font-mono">{v.variance}</span>
              <span className="text-[10px] text-slate-500">Nominal pack balance</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Battery Health (SoH)</span>
              <span className="text-sm font-extrabold text-slate-900 font-mono">{v.health}</span>
              <span className="text-[10px] text-slate-500">{v.cycles} logged</span>
            </div>
          </div>

          {/* Port and Thermal Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
              <span className="material-symbols-outlined text-[15px] text-emerald-600">ev_charger</span>
              <span>Port: Combined CCS2 + Type 2 AC (11 kW)</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
              <span className="material-symbols-outlined text-[15px] text-slate-500">thermostat</span>
              <span>Pack Temp: {v.temp}</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
              <span className="material-symbols-outlined text-[15px] text-slate-500">tire_repair</span>
              <span>Tire Pressure: 42 PSI (Cold)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Real-Time Battery Simulation Sliders (Engineering Controls) */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col gap-4">
        <div>
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Dynamic Tuning</span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            Real-Time Vehicle &amp; Trip Constraints (A* / DP Inputs)
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Changes made here directly alter the state-space in the DP charging algorithm and safety bounds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Battery Capacity (B_max)</span>
              <span className="font-bold font-mono text-emerald-800">{batteryCap} kWh</span>
            </div>
            <input
              type="range"
              min="40"
              max="120"
              value={batteryCap}
              onChange={(e) => setBatteryCap(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Standard range: 50–100 kWh</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Starting Charge (SoC_init)</span>
              <span className="font-bold font-mono text-emerald-800">{initialSoc} kWh ({Math.round((initialSoc / batteryCap) * 100)}%)</span>
            </div>
            <input
              type="range"
              min="15"
              max={batteryCap}
              value={initialSoc}
              onChange={(e) => setInitialSoc(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Home/Depot departure charge</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Safety Reserve Floor (B_min)</span>
              <span className="font-bold font-mono text-rose-700">{minReserve} kWh</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              value={minReserve}
              onChange={(e) => setMinReserve(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Strict arrival reserve (WP2 guard)</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Trip Time Budget (T_max)</span>
              <span className="font-bold font-mono text-slate-900">{maxTime} hrs</span>
            </div>
            <input
              type="range"
              min="10"
              max="26"
              step="0.5"
              value={maxTime}
              onChange={(e) => setMaxTime(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">DP upper bound (drive + charge)</span>
          </div>
        </div>
      </div>
    </div>
  )
}