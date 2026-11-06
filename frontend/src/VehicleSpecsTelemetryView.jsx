import React, { useState } from 'react'

export default function VehicleSpecsTelemetryView({
  batteryCap = 75,
  setBatteryCap,
  initialSoc = 65,
  setInitialSoc,
  minReserve = 12,
  setMinReserve,
  maxTime = 18.5,
  setMaxTime
}) {
  const [activeModelKey, setActiveModelKey] = useState('BYD_SEAL')

  const vehicleModels = {
    BYD_SEAL: {
      name: 'BYD Seal Performance AWD',
      edition: 'Cell-to-Body (CTB) Blade LFP',
      capacity: 82.5,
      usableKwh: 80.0,
      rangeReal: '510 km',
      acceptanceKW: 150,
      dragCd: '0.219 Cd',
      voltage: '550V Architecture',
      variance: '±0.006 V',
      cycles: '42 Cycles',
      health: '99.2% SoH',
      temp: '28.1°C Optimal',
      consumption: 0.17
    },
    TESLA_M3: {
      name: 'Tesla Model 3 Long Range',
      edition: 'Highland Dual Motor AWD',
      capacity: 78.1,
      usableKwh: 75.0,
      rangeReal: '485 km',
      acceptanceKW: 250,
      dragCd: '0.219 Cd',
      voltage: '400V Architecture',
      variance: '±0.008 V',
      cycles: '64 Cycles',
      health: '98.4% SoH',
      temp: '27.5°C Clamped',
      consumption: 0.16
    },
    MG4_TROPHY: {
      name: 'MG4 EV Trophy Long Range',
      edition: 'Modular Scalable Platform (MSP)',
      capacity: 64.0,
      usableKwh: 61.7,
      rangeReal: '390 km',
      acceptanceKW: 135,
      dragCd: '0.279 Cd',
      voltage: '400V Architecture',
      variance: '±0.012 V',
      cycles: '88 Cycles',
      health: '96.8% SoH',
      temp: '29.4°C Pre-conditioned',
      consumption: 0.18
    },
    DEEPAL_S07: {
      name: 'Deepal S07 Pure EV Edition',
      edition: 'EPA1 Dedicated EV Architecture',
      capacity: 66.8,
      usableKwh: 64.0,
      rangeReal: '410 km',
      acceptanceKW: 120,
      dragCd: '0.258 Cd',
      voltage: '400V Architecture',
      variance: '±0.009 V',
      cycles: '31 Cycles',
      health: '99.5% SoH',
      temp: '28.6°C Ambient',
      consumption: 0.175
    }
  }

  const v = vehicleModels[activeModelKey] || vehicleModels.BYD_SEAL

  function handleSelectModel(key) {
    setActiveModelKey(key)
    const spec = vehicleModels[key]
    if (setBatteryCap) setBatteryCap(spec.capacity)
    if (setInitialSoc) setInitialSoc(Math.round(spec.capacity * 0.85))
  }

  return (
    <div className="w-full px-4 lg:px-8 py-8 max-w-7xl mx-auto flex flex-col gap-6 text-[#25201A] font-sans">
      
      {/* 1. HERO TITLE & VEHICLE SWITCHER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#145A46] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Fleet Architecture & CAN-Bus Telemetry</span>
            <span className="text-[#A3998A]">•</span>
            <span className="text-emerald-800 font-bold">OBD-II Online</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#25201A] tracking-tight mt-1">
            Vehicle Specs & Battery Telemetry
          </h1>
          <p className="text-sm text-[#5E564B] mt-1 max-w-2xl leading-relaxed">
            Configure EV battery profiles, DC fast-charge acceptance thresholds, and aerodynamic efficiency benchmarks feeding the A* and DP routing algorithms.
          </p>
        </div>

        {/* Model Selector Bar */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#FCFAF6] p-1.5 rounded-xl border border-[#E4DDD2] shadow-sm">
          {Object.entries(vehicleModels).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelectModel(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeModelKey === key
                  ? 'bg-[#145A46] text-white shadow-xs'
                  : 'text-[#5E564B] hover:text-[#25201A] hover:bg-[#F4F0E8]'
              }`}
            >
              {item.name.split(' ')[0]} {item.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* 2. ACTIVE VEHICLE PROFILE CARD */}
      <div className="bg-[#FCFAF6] rounded-2xl p-6 sm:p-8 border border-[#E4DDD2] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono font-bold text-[#145A46] uppercase tracking-wider">
            {v.edition}
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-[#25201A] tracking-tight">
            {v.name}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#5E564B] mt-2 font-mono">
            <span>Architecture: <strong className="text-[#25201A]">{v.voltage}</strong></span>
            <span>•</span>
            <span>Aerodynamic Drag: <strong className="text-[#25201A]">{v.dragCd}</strong></span>
            <span>•</span>
            <span>Motorway Consumption: <strong className="text-[#145A46]">{v.consumption} kWh/km</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-initial bg-[#F4F0E8] px-4 py-3 rounded-xl border border-[#E4DDD2] flex flex-col text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E564B]">Battery Pack</span>
            <strong className="text-xl font-mono font-black text-[#25201A] mt-0.5">{v.capacity} kWh</strong>
          </div>
          <div className="flex-1 sm:flex-initial bg-[#F4F0E8] px-4 py-3 rounded-xl border border-[#E4DDD2] flex flex-col text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E564B]">Max DC Acceptance</span>
            <strong className="text-xl font-mono font-black text-[#145A46] mt-0.5">{v.acceptanceKW} kW</strong>
          </div>
          <div className="flex-1 sm:flex-initial bg-[#F4F0E8] px-4 py-3 rounded-xl border border-[#E4DDD2] flex flex-col text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E564B]">Real Range</span>
            <strong className="text-xl font-mono font-black text-[#25201A] mt-0.5">{v.rangeReal}</strong>
          </div>
        </div>
      </div>

      {/* 3. BATTERY CELL HEALTH & BMS TELEMETRY GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#FCFAF6] p-4 rounded-xl border border-[#E4DDD2] shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E564B] font-sans">
            State of Health (SoH)
          </span>
          <div className="text-2xl font-mono font-extrabold text-[#145A46] mt-1">{v.health}</div>
          <span className="text-[11px] text-[#5E564B] mt-1 pt-1 border-t border-[#E4DDD2]">
            Factory Degradation Cap
          </span>
        </div>

        <div className="bg-[#FCFAF6] p-4 rounded-xl border border-[#E4DDD2] shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E564B] font-sans">
            Thermal Regulation
          </span>
          <div className="text-2xl font-mono font-extrabold text-[#25201A] mt-1">{v.temp}</div>
          <span className="text-[11px] text-[#5E564B] mt-1 pt-1 border-t border-[#E4DDD2]">
            Active Liquid Loop
          </span>
        </div>

        <div className="bg-[#FCFAF6] p-4 rounded-xl border border-[#E4DDD2] shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E564B] font-sans">
            Cell Voltage Delta
          </span>
          <div className="text-2xl font-mono font-extrabold text-[#25201A] mt-1">{v.variance}</div>
          <span className="text-[11px] text-[#5E564B] mt-1 pt-1 border-t border-[#E4DDD2]">
            Balanced BMS Variance
          </span>
        </div>

        <div className="bg-[#FCFAF6] p-4 rounded-xl border border-[#E4DDD2] shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E564B] font-sans">
            Lifetime Cycles
          </span>
          <div className="text-2xl font-mono font-extrabold text-[#25201A] mt-1">{v.cycles}</div>
          <span className="text-[11px] text-[#5E564B] mt-1 pt-1 border-t border-[#E4DDD2]">
            LFP / NMC Cell Endurance
          </span>
        </div>
      </div>

      {/* 4. REAL-TIME ALGORITHMIC SLIDERS & PARAMETER CONTROLS */}
      <div className="bg-[#FCFAF6] rounded-xl p-6 border border-[#E4DDD2] shadow-sm flex flex-col gap-5">
        <div>
          <h3 className="font-display font-bold text-lg text-[#25201A]">
            Dynamic Programming Constraints &amp; Safety Buffers
          </h3>
          <p className="text-xs text-[#5E564B] mt-0.5">
            Adjusting these sliders directly modifies the mathematical constraints (B_min, T_max, B_max) used by the route solver.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {/* Slider 1: Battery Capacity */}
          <div className="flex flex-col gap-2 p-4 bg-[#F4F0E8]/70 rounded-xl border border-[#E4DDD2]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#25201A]">Pack Capacity (B_max)</span>
              <strong className="font-mono text-[#145A46]">{batteryCap} kWh</strong>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              step="5"
              value={batteryCap}
              onChange={(e) => setBatteryCap && setBatteryCap(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-[10px] text-[#8A8073]">Total gross usable energy pack</span>
          </div>

          {/* Slider 2: Departure SoC */}
          <div className="flex flex-col gap-2 p-4 bg-[#F4F0E8]/70 rounded-xl border border-[#E4DDD2]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#25201A]">Initial Departure Charge</span>
              <strong className="font-mono text-[#145A46]">{initialSoc} kWh ({Math.round((initialSoc / batteryCap) * 100)}%)</strong>
            </div>
            <input
              type="range"
              min="15"
              max={batteryCap}
              step="5"
              value={initialSoc}
              onChange={(e) => setInitialSoc && setInitialSoc(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-[10px] text-[#8A8073]">Charge available at start hub</span>
          </div>

          {/* Slider 3: Minimum Safety Reserve */}
          <div className="flex flex-col gap-2 p-4 bg-[#F4F0E8]/70 rounded-xl border border-[#E4DDD2]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#25201A]">Mandatory Safety Reserve (B_min)</span>
              <strong className="font-mono text-emerald-800">{minReserve} kWh ({Math.round((minReserve / batteryCap) * 100)}%)</strong>
            </div>
            <input
              type="range"
              min="8"
              max="25"
              step="1"
              value={minReserve}
              onChange={(e) => setMinReserve && setMinReserve(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-[10px] text-[#8A8073]">Emergency safety threshold at every station</span>
          </div>
        </div>
      </div>
    </div>
  )
}
