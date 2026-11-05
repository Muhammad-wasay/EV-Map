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
  const [activeModel, setActiveModel] = useState('BYD_ATTO_3')

  const vehicleModels = {
    BYD_ATTO_3: {
      name: 'BYD Atto 3 Long Range',
      type: 'Blade LFP Battery (AWD)',
      capacity: 75,
      acceptanceKW: 120,
      consumption: '0.18 kWh/km',
      rangeWLTP: '420 km',
      health: '98.4% SOH',
      temp: '28°C Optimal'
    },
    MG_ZS_EV: {
      name: 'MG ZS EV Trophy Edition',
      type: 'CATL Lithium-Ion (FWD)',
      capacity: 72,
      acceptanceKW: 90,
      consumption: '0.19 kWh/km',
      rangeWLTP: '380 km',
      health: '96.8% SOH',
      temp: '29°C Pre-conditioned'
    },
    TESLA_M3: {
      name: 'Tesla Model 3 Long Range',
      type: 'Nickel-Cobalt 2170 (Dual Motor)',
      capacity: 82,
      acceptanceKW: 150,
      consumption: '0.16 kWh/km',
      rangeWLTP: '530 km',
      health: '99.1% SOH',
      temp: '27°C Thermal Clamped'
    }
  }

  const currentVehicle = vehicleModels[activeModel]

  function handleSelectModel(key) {
    setActiveModel(key)
    const spec = vehicleModels[key]
    setBatteryCap(spec.capacity)
    setInitialSoc(Math.round(spec.capacity * 0.85))
  }

  return (
    <div className="w-full px-4 lg:px-8 py-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Fleet Profile &amp; Telemetry
            </span>
            <span className="text-outline">•</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
              OBD-II CAN-Bus Connected
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight mt-0.5">
            Vehicle Specs &amp; Battery Telemetry
          </h1>
          <p className="text-sm text-outline mt-1 max-w-2xl">
            Real-time battery degradation curves, peak DC fast-charge acceptance profiles, and motorway aero efficiency benchmarks for active vehicles across the Pakistan Motorway Network (M-2 / M-5).
          </p>
        </div>

        {/* Vehicle Switcher */}
        <div className="flex items-center gap-2">
          {Object.entries(vehicleModels).map(([key, v]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelectModel(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeModel === key
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
              }`}
            >
              {v.name.split(' ')[0]} {v.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Live Telemetry KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">battery_charging_80</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-outline block">State of Charge (SoC)</span>
            <div className="text-xl font-extrabold text-on-surface mt-0.5">
              {initialSoc} kWh{' '}
              <span className="text-primary text-sm font-semibold">
                ({Math.round((initialSoc / batteryCap) * 100)}%)
              </span>
            </div>
            <span className="text-[10px] text-outline font-semibold">
              {(initialSoc / 0.18).toFixed(0)} km highway range
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-tertiary-fixed/30 text-tertiary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">speed</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-outline block">Max Acceptance Speed</span>
            <div className="text-xl font-extrabold text-tertiary mt-0.5">
              {currentVehicle.acceptanceKW} kW DC
            </div>
            <span className="text-[10px] text-outline font-semibold">CCS2 Protocol Clamped</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary-fixed/40 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">health_and_safety</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-outline block">State of Health (SOH)</span>
            <div className="text-xl font-extrabold text-secondary mt-0.5">
              {currentVehicle.health}
            </div>
            <span className="text-[10px] text-outline font-semibold">Zero Cell Imbalance</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-container-high text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">device_thermostat</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-outline block">Pack Temperature</span>
            <div className="text-xl font-extrabold text-on-surface mt-0.5">
              {currentVehicle.temp}
            </div>
            <span className="text-[10px] text-tertiary font-semibold">Liquid Coolant Nominal</span>
          </div>
        </div>
      </div>

      {/* Interactive Spec Configuration Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <h3 className="font-bold text-base text-on-surface">
            Active Vehicle Telemetry Calibration
          </h3>
          <p className="text-xs text-outline">
            Modify internal battery constraints. The Dynamic Programming engine strictly abides by these specifications during stage transitions.
          </p>

          <div className="flex flex-col gap-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-outline">Total Usable Battery Capacity (B_max)</span>
                <strong className="text-primary">{batteryCap} kWh</strong>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={batteryCap}
                onChange={(e) => setBatteryCap(Number(e.target.value))}
                className="w-full h-1.5"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-outline">Current Departure SoC (B_0)</span>
                <strong className="text-tertiary">{initialSoc} kWh</strong>
              </div>
              <input
                type="range"
                min="20"
                max={batteryCap}
                value={initialSoc}
                onChange={(e) => setInitialSoc(Number(e.target.value))}
                className="w-full h-1.5"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-outline">Arrival Safety Floor (B_min)</span>
                <strong className="text-error">{minReserve} kWh (Mandatory Reserve)</strong>
              </div>
              <input
                type="range"
                min="8"
                max="25"
                value={minReserve}
                onChange={(e) => setMinReserve(Number(e.target.value))}
                className="w-full h-1.5"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-outline">Maximum Allowed Trip Duration (T_max)</span>
                <strong className="text-secondary">{maxTime} hrs</strong>
              </div>
              <input
                type="range"
                min="10"
                max="24"
                step="0.25"
                value={maxTime}
                onChange={(e) => setMaxTime(Number(e.target.value))}
                className="w-full h-1.5"
              />
            </div>
          </div>
        </div>

        {/* Charge Acceptance Curve Graphic */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-on-surface">DC Fast-Charge Acceptance Curve</h3>
            <span className="text-xs text-outline">
              Power taper characteristic across SoC states (0% &rarr; 100%)
            </span>
          </div>

          <div className="w-full h-44 bg-surface-container-low rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
            <svg viewBox="0 0 500 120" className="w-full h-full">
              <path
                d="M 20 20 Q 200 25 300 50 T 480 110"
                fill="none"
                stroke="#006b5c"
                strokeWidth="3.5"
              />
              <path
                d="M 20 20 Q 200 25 300 50 T 480 110 L 480 120 L 20 120 Z"
                fill="rgba(0, 194, 168, 0.15)"
              />
              <circle cx="20" cy="20" r="4" fill="#00c2a8" />
              <circle cx="200" cy="25" r="4" fill="#00c2a8" />
              <circle cx="300" cy="50" r="4" fill="#00c2a8" />
              <circle cx="480" cy="110" r="4" fill="#ba1a1a" />
              <text x="25" y="15" fill="#006b5c" fontSize="10" fontWeight="bold">
                Peak: {currentVehicle.acceptanceKW} kW (10%-60% SoC)
              </text>
              <text x="310" y="80" fill="#6c7a76" fontSize="9">
                Taper Zone (&gt;75% SoC)
              </text>
            </svg>
            <div className="flex justify-between text-[10px] text-outline pt-1 border-t border-outline-variant/20">
              <span>0% SoC</span>
              <span>25% SoC</span>
              <span>50% SoC</span>
              <span>75% SoC</span>
              <span>100% SoC</span>
            </div>
          </div>

          <div className="bg-primary/5 rounded-xl p-2.5 text-xs text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary shrink-0">info</span>
            <span>
              DP engine automatically prioritizes rapid charging within the <strong>10% &rarr; 70% SoC</strong> sweet-spot to minimize total journey duration.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
