import React, { useState, useMemo } from 'react'
import PixelCard from './components/PixelCard'

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
  // 1. Comprehensive Built-in EV Database
  const [vehicleCatalog, setVehicleCatalog] = useState({
    BYD_SEAL: {
      id: 'BYD_SEAL',
      name: 'BYD Seal Performance AWD',
      brand: 'BYD',
      bodyType: 'sedan_performance',
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
      consumption: 0.17,
      accel: '3.8s 0-100'
    },
    TESLA_M3: {
      id: 'TESLA_M3',
      name: 'Tesla Model 3 Long Range',
      brand: 'Tesla',
      bodyType: 'fastback_minimal',
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
      consumption: 0.16,
      accel: '4.4s 0-100'
    },
    TESLA_MY: {
      id: 'TESLA_MY',
      name: 'Tesla Model Y Long Range',
      brand: 'Tesla',
      bodyType: 'suv_crossover',
      edition: 'All-Wheel Drive Premium',
      capacity: 75.0,
      usableKwh: 72.0,
      rangeReal: '450 km',
      acceptanceKW: 250,
      dragCd: '0.230 Cd',
      voltage: '400V Architecture',
      variance: '±0.009 V',
      cycles: '51 Cycles',
      health: '98.8% SoH',
      temp: '28.0°C Active',
      consumption: 0.175,
      accel: '4.8s 0-100'
    },
    MG4_TROPHY: {
      id: 'MG4_TROPHY',
      name: 'MG4 EV Trophy Long Range',
      brand: 'MG',
      bodyType: 'hatch_sport',
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
      consumption: 0.18,
      accel: '6.1s 0-100'
    },
    MG_ZS_EV: {
      id: 'MG_ZS_EV',
      name: 'MG ZS EV Essence Long Range',
      brand: 'MG',
      bodyType: 'suv_crossover',
      edition: 'Dedicated Crossover Chassis',
      capacity: 51.1,
      usableKwh: 49.0,
      rangeReal: '320 km',
      acceptanceKW: 75,
      dragCd: '0.295 Cd',
      voltage: '400V Architecture',
      variance: '±0.014 V',
      cycles: '110 Cycles',
      health: '95.5% SoH',
      temp: '30.1°C Ambient',
      consumption: 0.19,
      accel: '8.2s 0-100'
    },
    DEEPAL_S07: {
      id: 'DEEPAL_S07',
      name: 'Deepal S07 Pure EV Edition',
      brand: 'Deepal',
      bodyType: 'suv_crossover',
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
      consumption: 0.175,
      accel: '6.7s 0-100'
    },
    DEEPAL_L07: {
      id: 'DEEPAL_L07',
      name: 'Deepal L07 Pure EV Sport Sedan',
      brand: 'Deepal',
      bodyType: 'fastback_minimal',
      edition: 'EPA1 Aerodynamic Fastback',
      capacity: 66.8,
      usableKwh: 64.0,
      rangeReal: '430 km',
      acceptanceKW: 120,
      dragCd: '0.230 Cd',
      voltage: '400V Architecture',
      variance: '±0.008 V',
      cycles: '24 Cycles',
      health: '99.7% SoH',
      temp: '27.9°C Ambient',
      consumption: 0.165,
      accel: '5.9s 0-100'
    },
    BYD_ATTO3: {
      id: 'BYD_ATTO3',
      name: 'BYD Atto 3 Extended Range',
      brand: 'BYD',
      bodyType: 'suv_crossover',
      edition: 'e-Platform 3.0 Blade Battery',
      capacity: 60.5,
      usableKwh: 58.0,
      rangeReal: '420 km',
      acceptanceKW: 88,
      dragCd: '0.290 Cd',
      voltage: '400V Architecture',
      variance: '±0.007 V',
      cycles: '55 Cycles',
      health: '98.9% SoH',
      temp: '28.4°C Ambient',
      consumption: 0.17,
      accel: '7.3s 0-100'
    },
    PORSCHE_TAYCAN: {
      id: 'PORSCHE_TAYCAN',
      name: 'Porsche Taycan Turbo S',
      brand: 'Porsche',
      bodyType: 'sedan_performance',
      edition: '800V Ultra-High Voltage Platform',
      capacity: 93.4,
      usableKwh: 89.0,
      rangeReal: '450 km',
      acceptanceKW: 270,
      dragCd: '0.220 Cd',
      voltage: '800V Ultra-Fast Architecture',
      variance: '±0.004 V',
      cycles: '18 Cycles',
      health: '99.8% SoH',
      temp: '26.8°C Liquid Track Chill',
      consumption: 0.21,
      accel: '2.8s 0-100'
    },
    AUDI_ETRON: {
      id: 'AUDI_ETRON',
      name: 'Audi e-tron GT quattro',
      brand: 'Audi',
      bodyType: 'sedan_performance',
      edition: 'J1 Performance EV Architecture',
      capacity: 93.4,
      usableKwh: 88.5,
      rangeReal: '488 km',
      acceptanceKW: 270,
      dragCd: '0.240 Cd',
      voltage: '800V Ultra-Fast Architecture',
      variance: '±0.005 V',
      cycles: '22 Cycles',
      health: '99.6% SoH',
      temp: '27.1°C Pre-conditioned',
      consumption: 0.20,
      accel: '3.3s 0-100'
    },
    HYUNDAI_IONIQ5: {
      id: 'HYUNDAI_IONIQ5',
      name: 'Hyundai Ioniq 5 Long Range AWD',
      brand: 'Hyundai',
      bodyType: 'suv_crossover',
      edition: 'Electric-Global Modular Platform (E-GMP)',
      capacity: 77.4,
      usableKwh: 74.0,
      rangeReal: '480 km',
      acceptanceKW: 350,
      dragCd: '0.288 Cd',
      voltage: '800V Ultra-Fast Architecture',
      variance: '±0.007 V',
      cycles: '40 Cycles',
      health: '99.1% SoH',
      temp: '27.8°C Active Loop',
      consumption: 0.178,
      accel: '5.1s 0-100'
    },
    KIA_EV6: {
      id: 'KIA_EV6',
      name: 'Kia EV6 GT-Line AWD',
      brand: 'Kia',
      bodyType: 'suv_crossover',
      edition: 'E-GMP Dedicated Platform',
      capacity: 77.4,
      usableKwh: 74.0,
      rangeReal: '506 km',
      acceptanceKW: 350,
      dragCd: '0.280 Cd',
      voltage: '800V Ultra-Fast Architecture',
      variance: '±0.006 V',
      cycles: '36 Cycles',
      health: '99.3% SoH',
      temp: '27.4°C Active Loop',
      consumption: 0.172,
      accel: '4.6s 0-100'
    },
    BMW_I4: {
      id: 'BMW_I4',
      name: 'BMW i4 eDrive40 Gran Coupe',
      brand: 'BMW',
      bodyType: 'sedan_performance',
      edition: 'Gen5 eDrive Synchronous Tech',
      capacity: 83.9,
      usableKwh: 80.7,
      rangeReal: '590 km',
      acceptanceKW: 205,
      dragCd: '0.240 Cd',
      voltage: '400V Architecture',
      variance: '±0.006 V',
      cycles: '48 Cycles',
      health: '98.9% SoH',
      temp: '28.0°C Optimal',
      consumption: 0.165,
      accel: '5.5s 0-100'
    },
    MERCEDES_EQE: {
      id: 'MERCEDES_EQE',
      name: 'Mercedes-Benz EQE 350+ Sedan',
      brand: 'Mercedes',
      bodyType: 'sedan_performance',
      edition: 'Electric Vehicle Architecture (EVA2)',
      capacity: 90.6,
      usableKwh: 87.0,
      rangeReal: '630 km',
      acceptanceKW: 170,
      dragCd: '0.220 Cd',
      voltage: '400V Architecture',
      variance: '±0.005 V',
      cycles: '29 Cycles',
      health: '99.4% SoH',
      temp: '27.2°C Whisper Liquid',
      consumption: 0.168,
      accel: '6.2s 0-100'
    },
    NISSAN_LEAF: {
      id: 'NISSAN_LEAF',
      name: 'Nissan Leaf e+ Long Range',
      brand: 'Nissan',
      bodyType: 'hatch_sport',
      edition: 'Intelligent e-Powertrain',
      capacity: 62.0,
      usableKwh: 59.0,
      rangeReal: '385 km',
      acceptanceKW: 100,
      dragCd: '0.280 Cd',
      voltage: '400V Architecture',
      variance: '±0.011 V',
      cycles: '95 Cycles',
      health: '96.2% SoH',
      temp: '29.8°C Air Cooled',
      consumption: 0.175,
      accel: '6.9s 0-100'
    }
  })

  const [activeModelKey, setActiveModelKey] = useState('BYD_SEAL')
  const [searchInput, setSearchInput] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [detectionAlert, setDetectionAlert] = useState(null)
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [customForm, setCustomForm] = useState({
    name: '',
    capacity: 75,
    range: 450,
    power: 150,
    bodyType: 'sedan_performance'
  })

  const currentCar = vehicleCatalog[activeModelKey] || vehicleCatalog.BYD_SEAL

  // Filter cars matching search query
  const matchingCars = useMemo(() => {
    const q = searchInput.toLowerCase().trim()
    if (!q) return []
    return Object.values(vehicleCatalog).filter(
      (car) =>
        car.name.toLowerCase().includes(q) ||
        car.brand.toLowerCase().includes(q) ||
        car.edition.toLowerCase().includes(q) ||
        car.id.toLowerCase().includes(q)
    )
  }, [searchInput, vehicleCatalog])

  // Select car & synchronize with algorithm state
  function selectAndLoadCar(carKey, customCarObj = null) {
    const spec = customCarObj || vehicleCatalog[carKey]
    if (!spec) return

    setActiveModelKey(carKey)
    if (setBatteryCap) setBatteryCap(spec.capacity)
    if (setInitialSoc) setInitialSoc(Math.round(spec.capacity * 0.85))

    setDetectionAlert(`✓ Auto-Detected & Configured: ${spec.name} (${spec.capacity} kWh • ${spec.voltage})`)
    setIsDropdownOpen(false)
    setSearchInput('')

    setTimeout(() => {
      setDetectionAlert(null)
    }, 4500)
  }

  // Handle auto-detect on typing or Enter key
  function handleSearchKeyDown(e) {
    if (e.key === 'Enter') {
      if (matchingCars.length > 0) {
        selectAndLoadCar(matchingCars[0].id)
      } else if (searchInput.trim()) {
        // Open custom car modal with prefilled name
        setCustomForm((prev) => ({ ...prev, name: searchInput.trim() }))
        setShowCustomModal(true)
        setIsDropdownOpen(false)
      }
    }
  }

  // Save custom car input
  function handleSaveCustomCar(e) {
    e.preventDefault()
    const customId = `CUSTOM_${Date.now()}`
    const newCar = {
      id: customId,
      name: customForm.name || 'Custom High-Performance EV',
      brand: 'Custom Fleet',
      bodyType: customForm.bodyType,
      edition: 'User Custom Telemetry Calibration',
      capacity: Number(customForm.capacity) || 75,
      usableKwh: (Number(customForm.capacity) || 75) * 0.96,
      rangeReal: `${customForm.range || 450} km`,
      acceptanceKW: Number(customForm.power) || 150,
      dragCd: '0.240 Cd',
      voltage: '400V - 800V Architecture',
      variance: '±0.007 V',
      cycles: '12 Cycles',
      health: '99.9% SoH',
      temp: '27.4°C Ambient',
      consumption: 0.17,
      accel: '4.2s 0-100'
    }

    setVehicleCatalog((prev) => ({ ...prev, [customId]: newCar }))
    selectAndLoadCar(customId, newCar)
    setShowCustomModal(false)
  }

  // Stylized SVG Car Visuals ("Saamne car bhi ajaye")
  function renderCarGraphic(bodyType) {
    return (
      <div className="relative w-full max-w-lg h-44 sm:h-52 flex items-center justify-center select-none overflow-hidden">
        {/* Ambient Neon Ground Glow */}
        <div className="absolute bottom-3 w-3/4 h-8 bg-emerald-500/25 blur-xl rounded-full" />
        <div className="absolute bottom-2 w-1/2 h-4 bg-[#00C2A8]/30 blur-md rounded-full" />

        {/* Dynamic Aerodynamic Flow Lines */}
        <div className="absolute inset-0 flex items-center justify-between pointer-events-none opacity-40">
          <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-[#00C2A8] to-transparent animate-pulse" />
          <div className="h-[1px] w-36 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Dynamic SVG Car Silhouette Based on Body Type */}
        <svg
          viewBox="0 0 540 200"
          className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(20,90,70,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="carBodyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#25201A" />
              <stop offset="50%" stopColor="#145A46" />
              <stop offset="100%" stopColor="#0B3025" />
            </linearGradient>
            <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00C2A8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#145A46" stopOpacity="0.25" />
            </linearGradient>
            <radialGradient id="wheelGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F4F0E8" />
              <stop offset="60%" stopColor="#5E564B" />
              <stop offset="100%" stopColor="#1C1814" />
            </radialGradient>
            <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Underbody Shadow */}
          <ellipse cx="270" cy="178" rx="220" ry="8" fill="#1C1814" opacity="0.3" />

          {/* Car Body Profiles */}
          {bodyType === 'sedan_performance' ? (
            /* Low-slung Sports Sedan (Taycan / Seal / Audi e-tron / BMW i4) */
            <g>
              {/* Lower Chassis & Side Skirts */}
              <path
                d="M50 148 C 90 148, 110 148, 125 152 C 145 154, 385 154, 405 152 C 420 148, 450 148, 495 142 C 510 138, 515 125, 490 118 C 450 110, 410 102, 380 94 C 330 68, 230 68, 175 96 C 130 114, 95 122, 50 128 C 38 132, 36 148, 50 148 Z"
                fill="url(#carBodyGrad)"
                stroke="#00C2A8"
                strokeWidth="1.5"
              />
              {/* Greenhouse / Aerodynamic Cockpit Glass */}
              <path
                d="M178 98 C 215 76, 275 74, 345 80 C 375 94, 395 106, 395 106 C 395 106, 220 108, 160 106 C 160 106, 168 102, 178 98 Z"
                fill="url(#glassGrad)"
                stroke="#FCFAF6"
                strokeWidth="1"
              />
              {/* Aerodynamic Shoulder Crease */}
              <path d="M75 126 Q 260 115 480 120" stroke="#00C2A8" strokeWidth="2" strokeDasharray="6 3" />
              {/* LED Headlight Laser Ribbon */}
              <path d="M485 120 L 512 126" stroke="#00E5FF" strokeWidth="4" filter="url(#laserGlow)" strokeLinecap="round" />
              {/* Tail Light Ribbon (Blade Red) */}
              <path d="M45 132 L 65 132" stroke="#EF4444" strokeWidth="4" filter="url(#laserGlow)" strokeLinecap="round" />
            </g>
          ) : bodyType === 'suv_crossover' ? (
            /* Athletic High-Stance Crossover / SUV (Deepal S07 / Model Y / Ioniq 5 / MG ZS) */
            <g>
              {/* SUV Chassis */}
              <path
                d="M50 152 C 90 152, 110 152, 125 154 C 145 156, 385 156, 405 154 C 420 152, 450 152, 490 144 C 508 140, 510 122, 480 112 C 445 100, 420 88, 380 72 C 340 56, 200 56, 160 76 C 120 98, 90 110, 50 122 C 36 128, 36 150, 50 152 Z"
                fill="url(#carBodyGrad)"
                stroke="#00C2A8"
                strokeWidth="1.5"
              />
              {/* Roof Rails */}
              <line x1="180" y1="52" x2="360" y2="52" stroke="#E4DDD2" strokeWidth="3" strokeLinecap="round" />
              {/* SUV Cockpit Windows */}
              <path
                d="M165 78 C 205 62, 280 60, 365 68 C 390 84, 408 98, 408 98 L 150 98 Z"
                fill="url(#glassGrad)"
                stroke="#FCFAF6"
                strokeWidth="1"
              />
              {/* Dynamic Shoulder Line */}
              <path d="M68 118 Q 270 108 475 112" stroke="#00C2A8" strokeWidth="2" strokeDasharray="5 3" />
              {/* Headlight */}
              <path d="M478 114 L 505 120" stroke="#00E5FF" strokeWidth="4" filter="url(#laserGlow)" strokeLinecap="round" />
              {/* Tail Light */}
              <path d="M45 125 L 65 125" stroke="#EF4444" strokeWidth="4" filter="url(#laserGlow)" strokeLinecap="round" />
            </g>
          ) : bodyType === 'hatch_sport' ? (
            /* Compact Hot Hatch (MG4 EV / Leaf) */
            <g>
              <path
                d="M50 150 C 90 150, 110 150, 125 152 C 145 154, 385 154, 405 152 C 420 150, 450 150, 488 144 C 504 138, 506 124, 478 115 C 440 104, 410 94, 375 80 C 330 64, 180 64, 130 84 C 95 105, 80 114, 50 124 C 38 128, 38 148, 50 150 Z"
                fill="url(#carBodyGrad)"
                stroke="#00C2A8"
                strokeWidth="1.5"
              />
              {/* Distinctive Twin Rear Aero Wing */}
              <path d="M125 76 L 105 70 L 95 82" stroke="#00C2A8" strokeWidth="2.5" strokeLinecap="round" />
              {/* Glass */}
              <path
                d="M136 85 C 180 70, 260 68, 360 76 C 385 92, 400 102, 400 102 L 126 102 Z"
                fill="url(#glassGrad)"
                stroke="#FCFAF6"
                strokeWidth="1"
              />
              {/* Headlight */}
              <path d="M475 116 L 498 122" stroke="#00E5FF" strokeWidth="4" filter="url(#laserGlow)" strokeLinecap="round" />
              {/* Tail Light */}
              <path d="M45 126 L 62 126" stroke="#EF4444" strokeWidth="4" filter="url(#laserGlow)" strokeLinecap="round" />
            </g>
          ) : (
            /* Minimal Fastback (Tesla Model 3 / Deepal L07) */
            <g>
              <path
                d="M50 148 C 90 148, 110 148, 125 150 C 145 152, 385 152, 405 150 C 420 148, 450 148, 492 142 C 508 136, 510 122, 480 114 C 440 104, 410 94, 375 78 C 330 62, 220 62, 160 84 C 120 106, 90 116, 50 126 C 38 130, 38 148, 50 148 Z"
                fill="url(#carBodyGrad)"
                stroke="#00C2A8"
                strokeWidth="1.5"
              />
              {/* Glass Dome */}
              <path
                d="M165 85 C 210 68, 280 66, 355 74 C 380 90, 396 102, 396 102 L 152 102 Z"
                fill="url(#glassGrad)"
                stroke="#FCFAF6"
                strokeWidth="1"
              />
              <path d="M480 118 L 504 124" stroke="#00E5FF" strokeWidth="4" filter="url(#laserGlow)" strokeLinecap="round" />
              <path d="M45 128 L 62 128" stroke="#EF4444" strokeWidth="4" filter="url(#laserGlow)" strokeLinecap="round" />
            </g>
          )}

          {/* Front Wheel Assembly */}
          <g transform="translate(420, 150)">
            <circle cx="0" cy="0" r="28" fill="#1C1814" />
            <circle cx="0" cy="0" r="22" fill="url(#wheelGrad)" stroke="#00C2A8" strokeWidth="2" />
            <circle cx="0" cy="0" r="8" fill="#00C2A8" />
            {/* Turbine Aero Blades */}
            <line x1="-16" y1="0" x2="16" y2="0" stroke="#FCFAF6" strokeWidth="2" />
            <line x1="0" y1="-16" x2="0" y2="16" stroke="#FCFAF6" strokeWidth="2" />
            <line x1="-11" y1="-11" x2="11" y2="11" stroke="#FCFAF6" strokeWidth="2" />
            <line x1="-11" y1="11" x2="11" y2="-11" stroke="#FCFAF6" strokeWidth="2" />
          </g>

          {/* Rear Wheel Assembly */}
          <g transform="translate(120, 150)">
            <circle cx="0" cy="0" r="28" fill="#1C1814" />
            <circle cx="0" cy="0" r="22" fill="url(#wheelGrad)" stroke="#00C2A8" strokeWidth="2" />
            <circle cx="0" cy="0" r="8" fill="#00C2A8" />
            {/* Turbine Aero Blades */}
            <line x1="-16" y1="0" x2="16" y2="0" stroke="#FCFAF6" strokeWidth="2" />
            <line x1="0" y1="-16" x2="0" y2="16" stroke="#FCFAF6" strokeWidth="2" />
            <line x1="-11" y1="-11" x2="11" y2="11" stroke="#FCFAF6" strokeWidth="2" />
            <line x1="-11" y1="11" x2="11" y2="-11" stroke="#FCFAF6" strokeWidth="2" />
          </g>

          {/* Smart License Plate */}
          <g transform="translate(470, 138)">
            <rect x="0" y="0" width="34" height="12" rx="2" fill="#FAF9F5" stroke="#25201A" strokeWidth="0.8" />
            <text x="17" y="9" fontSize="6.5" fontWeight="bold" fontFamily="monospace" fill="#145A46" textAnchor="middle">
              PAK•EV
            </text>
          </g>
        </svg>
      </div>
    )
  }

  return (
    <div className="w-full px-4 lg:px-8 py-8 max-w-7xl mx-auto flex flex-col gap-6 text-[#25201A] font-sans">
      
      {/* 1. HERO TITLE & INTELLIGENT AUTO-DETECT SEARCH BAR */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#145A46] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Smart Vehicle Detection & Telemetry Calibration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-[#25201A] tracking-tight mt-1">
            Vehicle Specs & Battery Telemetry
          </h1>
          <p className="text-sm text-[#5E564B] mt-1 leading-relaxed">
            Search or input your EV model — our platform automatically detects battery pack capacity ($B_\max$), DC fast-charging acceptance curve, and drag efficiency feeding the A* and DP routing solvers.
          </p>
        </div>

        {/* SMART INPUT / DETECT SEARCH BOX */}
        <div className="relative w-full lg:w-96">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E564B] mb-1.5 font-sans">
            Input / Detect Any EV Car
          </label>
          <div className="relative flex items-center bg-[#FCFAF6] border border-[#E4DDD2] focus-within:border-[#145A46] focus-within:ring-2 focus-within:ring-[#145A46]/10 rounded-xl px-3.5 py-2.5 shadow-sm transition-all">
            <span className="material-symbols-outlined text-[#145A46] text-[20px] mr-2">search</span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value)
                setIsDropdownOpen(true)
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={handleSearchKeyDown}
              placeholder="e.g. Taycan, Model Y, e-tron, Ioniq 5, BYD Atto..."
              className="w-full bg-transparent text-xs font-semibold text-[#25201A] placeholder:text-[#A3998A] outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('')
                  setIsDropdownOpen(false)
                }}
                className="text-[#8A8073] hover:text-[#25201A] text-xs font-bold ml-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Autodetect Live Suggestions Dropdown */}
          {isDropdownOpen && searchInput.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#FCFAF6] border border-[#E4DDD2] rounded-xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto animate-fade-in font-sans">
              <div className="p-2 bg-[#F4F0E8] border-b border-[#E4DDD2] text-[10px] font-bold text-[#5E564B] uppercase tracking-wider flex items-center justify-between">
                <span>Matching EV Catalog</span>
                <span className="font-mono">{matchingCars.length} models</span>
              </div>

              {matchingCars.length > 0 ? (
                matchingCars.map((car) => (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() => selectAndLoadCar(car.id)}
                    className="w-full text-left p-3 hover:bg-[#F4F0E8] border-b border-[#E4DDD2]/60 last:border-b-0 flex items-center justify-between gap-3 transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-xs text-[#25201A] group-hover:text-[#145A46] transition-colors flex items-center gap-1.5">
                        <span>{car.name}</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 text-[10px] font-mono">
                          {car.brand}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#5E564B] mt-0.5 block">{car.edition}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <strong className="text-xs font-mono text-[#145A46] block">{car.capacity} kWh</strong>
                      <span className="text-[10px] text-[#8A8073] font-mono">{car.rangeReal}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-xs text-[#5E564B]">No exact match for "{searchInput}" in standard catalog.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomForm((prev) => ({ ...prev, name: searchInput.trim() }))
                      setShowCustomModal(true)
                      setIsDropdownOpen(false)
                    }}
                    className="mt-2.5 px-3 py-1.5 bg-[#145A46] text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors shadow-xs inline-flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">add_circle</span>
                    <span>Configure "{searchInput.trim()}" as Custom EV</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AUTO-DETECTION SUCCESS BANNER */}
      {detectionAlert && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs font-semibold flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700 text-[20px]">electric_bolt</span>
            <span>{detectionAlert}</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-800 bg-white/70 px-2 py-0.5 rounded border border-emerald-200">
            A* & DP Constraints Recalibrated
          </span>
        </div>
      )}

      {/* QUICK PRESET CHIPS BAR (POPULAR FLEET QUICK SWITCH) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8073] whitespace-nowrap">
          Quick Switch:
        </span>
        {['BYD_SEAL', 'TESLA_M3', 'MG4_TROPHY', 'DEEPAL_S07', 'PORSCHE_TAYCAN', 'AUDI_ETRON', 'HYUNDAI_IONIQ5'].map((key) => {
          const item = vehicleCatalog[key]
          if (!item) return null
          const isSelected = activeModelKey === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => selectAndLoadCar(key)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#145A46] text-white shadow-sm'
                  : 'bg-[#FCFAF6] border border-[#E4DDD2] text-[#5E564B] hover:text-[#25201A] hover:bg-[#F4F0E8]'
              }`}
            >
              <span>{item.name.split(' ')[0]} {item.name.split(' ')[1]}</span>
              <span className={`text-[10px] font-mono ${isSelected ? 'text-emerald-200' : 'text-[#8A8073]'}`}>
                {item.capacity} kWh
              </span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => setShowCustomModal(true)}
          className="px-3 py-1.5 rounded-lg font-semibold bg-[#F4F0E8] border border-[#E4DDD2] text-[#145A46] hover:bg-[#EAE5DA] transition-all whitespace-nowrap flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[15px]">add</span>
          <span>Add Custom EV</span>
        </button>
      </div>

      {/* 2. "SAAMNE CAR BHI AJAYE" — FRONT & CENTER VISUAL SHOWCASE BANNER */}
      <PixelCard
        variant="emerald"
        theme="light"
        radius={20}
        className="p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 border border-[#E4DDD2]"
      >
        {/* Left Column: Model Badges, Title & Aero Telemetry */}
        <div className="flex flex-col gap-2 max-w-xl w-full">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-mono font-bold uppercase tracking-wider">
              {currentCar.voltage}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F4F0E8] text-[#5E564B] text-[11px] font-mono font-bold">
              {currentCar.edition}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-[#25201A] tracking-tight mt-1">
            {currentCar.name}
          </h2>

          <p className="text-xs text-[#5E564B] font-mono leading-relaxed mt-1">
            Aerodynamic Drag Coefficient <strong className="text-[#25201A]">{currentCar.dragCd}</strong> • Motorway Consumption Rate <strong className="text-[#145A46]">{currentCar.consumption} kWh/km</strong> • Acceleration <strong className="text-[#25201A]">{currentCar.accel}</strong>
          </p>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-3 bg-[#F4F0E8]/80 rounded-xl border border-[#E4DDD2] flex flex-col text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E564B]">Total Pack</span>
              <strong className="text-xl font-mono font-black text-[#25201A] mt-0.5">{currentCar.capacity} kWh</strong>
              <span className="text-[10px] text-[#8A8073] font-mono mt-0.5">{currentCar.usableKwh} kWh net</span>
            </div>

            <div className="p-3 bg-[#F4F0E8]/80 rounded-xl border border-[#E4DDD2] flex flex-col text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E564B]">Max DC Charge</span>
              <strong className="text-xl font-mono font-black text-[#145A46] mt-0.5">{currentCar.acceptanceKW} kW</strong>
              <span className="text-[10px] text-emerald-800 font-mono mt-0.5">Peak Curve Rate</span>
            </div>

            <div className="p-3 bg-[#F4F0E8]/80 rounded-xl border border-[#E4DDD2] flex flex-col text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E564B]">Corridor Range</span>
              <strong className="text-xl font-mono font-black text-[#25201A] mt-0.5">{currentCar.rangeReal}</strong>
              <span className="text-[10px] text-[#8A8073] font-mono mt-0.5">EPA / WLTP Real</span>
            </div>
          </div>
        </div>

        {/* Right Column: Front-and-Center Stylized EV Car Illustration */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
          {renderCarGraphic(currentCar.bodyType)}
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#5E564B] mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Active Vehicle Loaded into Solver State</span>
          </div>
        </div>
      </PixelCard>

      {/* 3. BATTERY CELL HEALTH & BMS TELEMETRY GRID (4 PIXELCARD CARDS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <PixelCard variant="emerald" theme="light" radius={14} className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E564B] font-sans">
            State of Health (SoH)
          </span>
          <div className="text-2xl font-mono font-extrabold text-[#145A46] mt-1">{currentCar.health}</div>
          <span className="text-[11px] text-[#5E564B] mt-1 pt-1 border-t border-[#E4DDD2]">
            Factory Degradation Cap
          </span>
        </PixelCard>

        <PixelCard variant="emerald" theme="light" radius={14} className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E564B] font-sans">
            Thermal Regulation
          </span>
          <div className="text-2xl font-mono font-extrabold text-[#25201A] mt-1">{currentCar.temp}</div>
          <span className="text-[11px] text-[#5E564B] mt-1 pt-1 border-t border-[#E4DDD2]">
            Active Liquid Loop
          </span>
        </PixelCard>

        <PixelCard variant="emerald" theme="light" radius={14} className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E564B] font-sans">
            Cell Voltage Delta
          </span>
          <div className="text-2xl font-mono font-extrabold text-[#25201A] mt-1">{currentCar.variance}</div>
          <span className="text-[11px] text-[#5E564B] mt-1 pt-1 border-t border-[#E4DDD2]">
            Balanced BMS Variance
          </span>
        </PixelCard>

        <PixelCard variant="emerald" theme="light" radius={14} className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E564B] font-sans">
            Lifetime Cycles
          </span>
          <div className="text-2xl font-mono font-extrabold text-[#25201A] mt-1">{currentCar.cycles}</div>
          <span className="text-[11px] text-[#5E564B] mt-1 pt-1 border-t border-[#E4DDD2]">
            LFP / NMC Cell Endurance
          </span>
        </PixelCard>
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
              max="135"
              step="1"
              value={batteryCap}
              onChange={(e) => setBatteryCap && setBatteryCap(Number(e.target.value))}
              className="w-full accent-[#145A46]"
            />
            <span className="text-[10px] text-[#8A8073]">Total gross usable energy pack</span>
          </div>

          {/* Slider 2: Departure SoC */}
          <div className="flex flex-col gap-2 p-4 bg-[#F4F0E8]/70 rounded-xl border border-[#E4DDD2]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#25201A]">Initial Departure Charge</span>
              <strong className="font-mono text-[#145A46]">
                {initialSoc} kWh ({Math.round((initialSoc / batteryCap) * 100)}%)
              </strong>
            </div>
            <input
              type="range"
              min="15"
              max={batteryCap}
              step="1"
              value={initialSoc}
              onChange={(e) => setInitialSoc && setInitialSoc(Number(e.target.value))}
              className="w-full accent-[#145A46]"
            />
            <span className="text-[10px] text-[#8A8073]">Charge available at start hub</span>
          </div>

          {/* Slider 3: Minimum Safety Reserve */}
          <div className="flex flex-col gap-2 p-4 bg-[#F4F0E8]/70 rounded-xl border border-[#E4DDD2]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#25201A]">Mandatory Safety Reserve (B_min)</span>
              <strong className="font-mono text-emerald-800">
                {minReserve} kWh ({Math.round((minReserve / batteryCap) * 100)}%)
              </strong>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={minReserve}
              onChange={(e) => setMinReserve && setMinReserve(Number(e.target.value))}
              className="w-full accent-[#145A46]"
            />
            <span className="text-[10px] text-[#8A8073]">Emergency safety threshold at every station</span>
          </div>
        </div>
      </div>

      {/* 5. CUSTOM VEHICLE CONFIGURATION MODAL */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FCFAF6] rounded-2xl border border-[#E4DDD2] shadow-2xl max-w-md w-full p-6 animate-fade-in font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4DDD2]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#145A46]">electric_car</span>
                <h3 className="font-display font-bold text-lg text-[#25201A]">Configure Custom EV</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="text-[#8A8073] hover:text-[#25201A] font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomCar} className="mt-4 flex flex-col gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#25201A] mb-1">Vehicle Model / Brand Name</label>
                <input
                  type="text"
                  required
                  value={customForm.name}
                  onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                  placeholder="e.g. Lotus Emeya, Polestar 4, CyberTruck..."
                  className="w-full bg-[#F4F0E8] border border-[#E4DDD2] rounded-xl px-3 py-2 text-xs text-[#25201A] outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#25201A] mb-1">Battery Size (kWh)</label>
                  <input
                    type="number"
                    min="30"
                    max="200"
                    required
                    value={customForm.capacity}
                    onChange={(e) => setCustomForm({ ...customForm, capacity: e.target.value })}
                    className="w-full bg-[#F4F0E8] border border-[#E4DDD2] rounded-xl px-3 py-2 font-mono text-xs text-[#25201A] outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#25201A] mb-1">Real-World Range (km)</label>
                  <input
                    type="number"
                    min="150"
                    max="1000"
                    required
                    value={customForm.range}
                    onChange={(e) => setCustomForm({ ...customForm, range: e.target.value })}
                    className="w-full bg-[#F4F0E8] border border-[#E4DDD2] rounded-xl px-3 py-2 font-mono text-xs text-[#25201A] outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#25201A] mb-1">Max Charge (kW DC)</label>
                  <input
                    type="number"
                    min="50"
                    max="400"
                    required
                    value={customForm.power}
                    onChange={(e) => setCustomForm({ ...customForm, power: e.target.value })}
                    className="w-full bg-[#F4F0E8] border border-[#E4DDD2] rounded-xl px-3 py-2 font-mono text-xs text-[#25201A] outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#25201A] mb-1">Body Aerodynamics</label>
                  <select
                    value={customForm.bodyType}
                    onChange={(e) => setCustomForm({ ...customForm, bodyType: e.target.value })}
                    className="w-full bg-[#F4F0E8] border border-[#E4DDD2] rounded-xl px-2.5 py-2 text-xs text-[#25201A] outline-none font-semibold"
                  >
                    <option value="sedan_performance">Sports Sedan</option>
                    <option value="fastback_minimal">Fastback</option>
                    <option value="suv_crossover">SUV / Crossover</option>
                    <option value="hatch_sport">Compact Hatch</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E4DDD2] mt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5E564B] hover:bg-[#F4F0E8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#145A46] text-white hover:bg-emerald-800 transition-colors shadow-xs"
                >
                  Save & Calibrate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
