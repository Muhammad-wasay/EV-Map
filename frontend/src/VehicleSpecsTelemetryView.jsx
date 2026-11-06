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
      image: '/vehicles/byd_seal.png',
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
      image: '/vehicles/tesla_model_3.png',
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
      image: '/vehicles/tesla_model_y.png',
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
      image: '/vehicles/mg_zs_ev.png',
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
      image: '/vehicles/mg_zs_ev.png',
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
      image: '/vehicles/deepal_s07.png',
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
      image: '/vehicles/deepal_l07.png',
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
      image: '/vehicles/byd_seal.png',
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
      image: '/vehicles/porsche_taycan.png',
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
      image: '/vehicles/audi_etron.png',
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
      image: '/vehicles/hyundai_ioniq.png',
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
      image: '/vehicles/hyundai_ioniq.png',
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
      image: '/vehicles/porsche_taycan.png',
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
      image: '/vehicles/audi_etron.png',
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
      image: '/vehicles/nissan_leaf.png',
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

    // Enhanced Procedural Vector EV Model Generator with Authentic Company Branding & Distinct Proportions
  function renderCarGraphic(car) {
    const brand = (car.brand || 'EV').toUpperCase()
    const bodyType = car.bodyType || 'sedan_performance'
    const name = car.name || 'Electric Vehicle'

    // Brand metadata: emblems, badges, accents
    const brandStyles = {
      BYD: {
        plate: 'PAK • BYD',
        sideText: 'BYD SEAL • CTB BLADE',
        accent: '#00E5FF',
        badge: 'BYD',
        badgeType: 'text_pill'
      },
      TESLA: {
        plate: 'PAK • TSLA',
        sideText: 'TESLA • DUAL MOTOR AWD',
        accent: '#38BDF8',
        badge: 'T',
        badgeType: 'tesla_t'
      },
      DEEPAL: {
        plate: 'PAK • DPL',
        sideText: `${car.name.toUpperCase()} • EPA1`,
        accent: '#F59E0B',
        badge: 'DEEPAL',
        badgeType: 'diamond'
      },
      PORSCHE: {
        plate: 'PAK • PRSCH',
        sideText: 'PORSCHE • TAYCAN TURBO S',
        accent: '#FBBF24',
        badge: 'PORSCHE',
        badgeType: 'crest'
      },
      AUDI: {
        plate: 'PAK • AUDI',
        sideText: 'AUDI • e-tron GT quattro',
        accent: '#EF4444',
        badge: 'AUDI',
        badgeType: 'rings'
      },
      MG: {
        plate: 'PAK • MG',
        sideText: `${car.name.toUpperCase()} • EV`,
        accent: '#00C2A8',
        badge: 'MG',
        badgeType: 'hexagon'
      },
      HYUNDAI: {
        plate: 'PAK • HYUN',
        sideText: 'HYUNDAI • IONIQ 5 E-GMP',
        accent: '#00E5FF',
        badge: 'H',
        badgeType: 'hyundai_h'
      },
      KIA: {
        plate: 'PAK • KIA',
        sideText: 'KIA • EV6 GT-LINE',
        accent: '#10B981',
        badge: 'KIA',
        badgeType: 'text_pill'
      },
      BMW: {
        plate: 'PAK • BMW',
        sideText: 'BMW • i4 eDrive40',
        accent: '#3B82F6',
        badge: 'BMW',
        badgeType: 'bmw_roundel'
      },
      MERCEDES: {
        plate: 'PAK • MB',
        sideText: 'MERCEDES-BENZ • EQE 350+',
        accent: '#06B6D4',
        badge: 'MB',
        badgeType: 'three_star'
      },
      NISSAN: {
        plate: 'PAK • NIS',
        sideText: 'NISSAN • ZERO EMISSION',
        accent: '#38BDF8',
        badge: 'NISSAN',
        badgeType: 'text_pill'
      }
    }

    const b = brandStyles[brand] || {
      plate: 'PAK • EV',
      sideText: `${name.toUpperCase()} • PURE EV`,
      accent: '#00C2A8',
      badge: brand.slice(0, 6),
      badgeType: 'text_pill'
    }

    const isSUV = bodyType === 'suv_crossover'
    const isHatch = bodyType === 'hatch_sport'
    const isFastback = bodyType === 'fastback_minimal'
    const isSlimSedan = bodyType === 'sedan_performance'

    return (
      <div className="relative w-full max-w-xl h-60 sm:h-72 flex flex-col items-center justify-center select-none overflow-visible group">
        {/* Soft Ambient Ground Neon Spotlight */}
        <div className="absolute bottom-6 w-4/5 h-12 bg-emerald-500/20 blur-2xl rounded-full" />
        <div className="absolute bottom-5 w-3/5 h-6 bg-[#00C2A8]/30 blur-lg rounded-full" />
        <div className="absolute bottom-4 w-2/3 h-4 bg-[#25201A]/25 blur-sm rounded-full" />

        {/* Ambient Aerodynamic Flow Streaks */}
        <div className="absolute inset-0 flex flex-col justify-around pointer-events-none opacity-40 px-2">
          <div className="h-[1px] w-28 self-start bg-gradient-to-r from-transparent via-[#00C2A8] to-transparent animate-pulse" />
          <div className="h-[1px] w-36 self-end bg-gradient-to-r from-transparent via-amber-300 to-transparent animate-pulse" style={{ animationDelay: '0.6s' }} />
        </div>

        {/* Scalable High-Detail Vector EV Vehicle Graphics */}
        <svg
          viewBox="0 0 640 230"
          className="w-full h-full object-contain filter drop-shadow-[0_18px_32px_rgba(20,90,70,0.32)] transition-transform duration-500 ease-out group-hover:scale-[1.03] group-hover:-translate-y-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Deep Metallic British Racing Green Body Paint */}
            <linearGradient id="bodyPaintGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E2822" />
              <stop offset="35%" stopColor="#145A46" />
              <stop offset="70%" stopColor="#1F7A5E" />
              <stop offset="100%" stopColor="#0B3025" />
            </linearGradient>

            {/* Glossy Aerodynamic Canopy Glass */}
            <linearGradient id="canopyGlassGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.75" />
              <stop offset="40%" stopColor="#00C2A8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0D3B2E" stopOpacity="0.2" />
            </linearGradient>

            {/* Brushed Aluminum Side Blade Trim */}
            <linearGradient id="brushedAlloyGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FCFAF6" />
              <stop offset="50%" stopColor="#C4B9A7" />
              <stop offset="100%" stopColor="#FAF9F5" />
            </linearGradient>

            {/* Turbine Machined Alloy Wheels */}
            <radialGradient id="alloyWheelGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FCFAF6" />
              <stop offset="45%" stopColor="#8A8073" />
              <stop offset="85%" stopColor="#2E2820" />
              <stop offset="100%" stopColor="#15120E" />
            </radialGradient>

            {/* Laser Headlight & Tail Light Glow Filters */}
            <filter id="laserBeamGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
            <filter id="underglowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
            </filter>
          </defs>

          {/* 1. Ground Shadow & Battery Pack Floor Illumination */}
          <ellipse cx="320" cy="196" rx="265" ry="10" fill="#15120E" opacity="0.45" />
          <ellipse cx="320" cy="193" rx="210" ry="4" fill="#00C2A8" opacity="0.4" filter="url(#underglowFilter)" />

          {/* 2. BODY GEOMETRY BASED ON PROPORTION TYPE */}
          {isSUV ? (
            /* =================== A. TALL, MUSCULAR SUV / JEEP PROPORTION =================== */
            <g id="suv_body">
              {/* Rugged Black Wheel Arch & Lower Body Cladding */}
              <path
                d="M50 174 C 75 174, 95 174, 115 178 C 145 182, 455 182, 485 178 C 505 174, 550 174, 590 162 C 606 156, 610 136, 575 124 C 540 110, 500 96, 440 68 C 390 48, 220 48, 170 70 C 120 94, 85 110, 45 128 C 30 135, 32 172, 50 174 Z"
                fill="#15120E"
              />
              {/* Main SUV High-Stance Body */}
              <path
                d="M54 168 C 80 168, 100 168, 120 172 C 145 175, 450 175, 475 172 C 495 168, 540 168, 582 156 C 598 150, 602 134, 570 122 C 532 108, 492 94, 435 66 C 388 46, 225 46, 175 68 C 128 90, 92 106, 50 124 C 36 130, 38 166, 54 168 Z"
                fill="url(#bodyPaintGrad)"
                stroke="#00C2A8"
                strokeWidth="1.5"
              />
              {/* Matte Aluminum Roof Rails */}
              <line x1="205" y1="42" x2="430" y2="42" stroke="url(#brushedAlloyGrad)" strokeWidth="4" strokeLinecap="round" />
              <line x1="230" y1="46" x2="230" y2="42" stroke="#8A8073" strokeWidth="2.5" />
              <line x1="405" y1="46" x2="405" y2="42" stroke="#8A8073" strokeWidth="2.5" />

              {/* High SUV Panoramic Window Cockpit */}
              <path
                d="M182 70 C 230 52, 315 50, 420 60 C 452 78, 480 96, 480 96 L 160 96 C 160 96, 170 80, 182 70 Z"
                fill="url(#canopyGlassGrad)"
                stroke="#FCFAF6"
                strokeWidth="1.2"
              />
              {/* Window Pillar Dividers (B-Pillar & C-Pillar) */}
              <line x1="280" y1="52" x2="280" y2="96" stroke="#15120E" strokeWidth="4" />
              <line x1="380" y1="56" x2="380" y2="96" stroke="#15120E" strokeWidth="4" />

              {/* Muscular Shoulder Character Line */}
              <path d="M75 126 Q 310 114 565 118" stroke="#00C2A8" strokeWidth="2.5" strokeDasharray="6 3" />
              <path d="M120 148 L 470 148" stroke="url(#brushedAlloyGrad)" strokeWidth="2" />

              {/* Headlight: Tall Command Projector Towers */}
              <path d="M570 120 L 602 128" stroke="#00E5FF" strokeWidth="5" filter="url(#laserBeamGlow)" strokeLinecap="round" />
              <circle cx="585" cy="124" r="3" fill="#FFFFFF" />

              {/* Tail Light: Heavy-Duty Blade Ribbon */}
              <path d="M42 130 L 68 130" stroke="#EF4444" strokeWidth="5" filter="url(#laserBeamGlow)" strokeLinecap="round" />
            </g>
          ) : isHatch ? (
            /* =================== B. AGILITY HOT HATCH PROPORTION =================== */
            <g id="hatch_body">
              {/* Hot Hatch Body */}
              <path
                d="M52 168 C 80 168, 100 168, 120 172 C 145 174, 445 174, 470 172 C 490 168, 530 168, 572 158 C 588 152, 592 136, 564 125 C 524 112, 484 100, 435 84 C 385 66, 215 66, 150 90 C 110 110, 85 120, 50 132 C 38 136, 38 166, 52 168 Z"
                fill="url(#bodyPaintGrad)"
                stroke="#00C2A8"
                strokeWidth="1.5"
              />
              {/* Twin-Blade Aerodynamic Floating Rear Wing */}
              <path d="M145 80 L 115 72 L 102 86" stroke="#00C2A8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              {/* Hatch Cockpit Glass */}
              <path
                d="M156 92 C 210 74, 290 72, 420 82 C 448 98, 465 110, 465 110 L 140 110 Z"
                fill="url(#canopyGlassGrad)"
                stroke="#FCFAF6"
                strokeWidth="1.2"
              />
              <line x1="270" y1="74" x2="270" y2="110" stroke="#15120E" strokeWidth="3" />
              {/* Dynamic Fangs & Lights */}
              <path d="M555 124 L 585 132" stroke="#00E5FF" strokeWidth="4.5" filter="url(#laserBeamGlow)" strokeLinecap="round" />
              <path d="M42 136 L 64 136" stroke="#EF4444" strokeWidth="4.5" filter="url(#laserBeamGlow)" strokeLinecap="round" />
            </g>
          ) : isFastback ? (
            /* =================== C. MINIMALIST AERO FASTBACK PROPORTION =================== */
            <g id="fastback_body">
              {/* Clean Teardrop Fastback Body */}
              <path
                d="M50 166 C 80 166, 100 166, 120 170 C 145 172, 450 172, 475 170 C 495 166, 535 166, 582 156 C 600 150, 602 134, 570 124 C 530 112, 490 100, 442 80 C 388 60, 240 60, 180 84 C 132 108, 95 120, 50 130 C 36 134, 36 164, 50 166 Z"
                fill="url(#bodyPaintGrad)"
                stroke="#00C2A8"
                strokeWidth="1.5"
              />
              {/* Panoramic Glass Canopy */}
              <path
                d="M185 86 C 240 66, 320 64, 425 74 C 458 92, 478 106, 478 106 L 165 106 Z"
                fill="url(#canopyGlassGrad)"
                stroke="#FCFAF6"
                strokeWidth="1.2"
              />
              <path d="M565 124 L 595 130" stroke="#00E5FF" strokeWidth="4.5" filter="url(#laserBeamGlow)" strokeLinecap="round" />
              <path d="M40 134 L 64 134" stroke="#EF4444" strokeWidth="4.5" filter="url(#laserBeamGlow)" strokeLinecap="round" />
            </g>
          ) : (
            /* =================== D. SLIM LOW-SLUNG PERFORMANCE SPORTS SEDAN =================== */
            <g id="slim_sedan_body">
              {/* Low-slung Sports Chassis with Front Splitter & Rear Diffuser */}
              <path
                d="M48 164 C 80 164, 100 164, 120 168 C 145 170, 455 170, 480 168 C 500 164, 545 164, 592 154 C 608 148, 610 132, 580 122 C 535 110, 490 98, 445 78 C 388 56, 250 56, 185 82 C 132 106, 95 118, 48 126 C 34 130, 34 162, 48 164 Z"
                fill="url(#bodyPaintGrad)"
                stroke="#00C2A8"
                strokeWidth="1.5"
              />
              {/* Front Aero Lip & Low Ground Skirts */}
              <path d="M545 158 L 598 152" stroke="url(#brushedAlloyGrad)" strokeWidth="2.5" strokeLinecap="round" />
              {/* Low Coupe Cockpit Glass */}
              <path
                d="M190 84 C 245 62, 330 60, 428 72 C 460 90, 480 104, 480 104 L 170 104 Z"
                fill="url(#canopyGlassGrad)"
                stroke="#FCFAF6"
                strokeWidth="1.2"
              />
              {/* Laser Matrix Light Bar */}
              <path d="M570 122 L 602 128" stroke="#00E5FF" strokeWidth="5" filter="url(#laserBeamGlow)" strokeLinecap="round" />
              <circle cx="586" cy="125" r="2.5" fill="#FFFFFF" />
              {/* Full-width Tail Blade Light */}
              <path d="M38 132 L 64 132" stroke="#EF4444" strokeWidth="5" filter="url(#laserBeamGlow)" strokeLinecap="round" />
            </g>
          )}

          {/* 3. AUTHENTIC COMPANY BRANDING & MODEL BADGING */}
          {/* A. Lower Door / Side Skirt Brushed Blade with Model Name */}
          <g transform={`translate(${isSUV ? 180 : 190}, ${isSUV ? 146 : 142})`}>
            <rect x="0" y="0" width="220" height="15" rx="3" fill="#15120E" stroke="url(#brushedAlloyGrad)" strokeWidth="1" />
            <text x="110" y="11" fontSize="8" fontWeight="bold" fontFamily="monospace" fill={b.accent} textAnchor="middle" letterSpacing="1.2">
              {b.sideText}
            </text>
          </g>

          {/* B. Front Nose Company Emblem Logo */}
          <g transform={`translate(${isSUV ? 565 : 570}, ${isSUV ? 134 : 132})`}>
            {b.badgeType === 'tesla_t' ? (
              <g>
                <circle cx="0" cy="0" r="9" fill="#15120E" stroke="#E4DDD2" strokeWidth="1" />
                <path d="M-5 -4 L5 -4 M0 -4 L0 4 M-3 -1 Q0 2 3 -1" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </g>
            ) : b.badgeType === 'rings' ? (
              <g>
                <rect x="-14" y="-6" width="28" height="12" rx="3" fill="#15120E" stroke="#E4DDD2" strokeWidth="0.8" />
                <circle cx="-7" cy="0" r="4" stroke="#FCFAF6" strokeWidth="1.2" fill="none" />
                <circle cx="-2" cy="0" r="4" stroke="#FCFAF6" strokeWidth="1.2" fill="none" />
                <circle cx="3" cy="0" r="4" stroke="#FCFAF6" strokeWidth="1.2" fill="none" />
                <circle cx="8" cy="0" r="4" stroke="#FCFAF6" strokeWidth="1.2" fill="none" />
              </g>
            ) : b.badgeType === 'diamond' ? (
              <g>
                <circle cx="0" cy="0" r="9" fill="#15120E" stroke="#F59E0B" strokeWidth="1" />
                <polygon points="0,-6 6,0 0,6 -6,0" fill="#F59E0B" />
              </g>
            ) : b.badgeType === 'crest' ? (
              <g>
                <rect x="-8" y="-7" width="16" height="14" rx="2" fill="#15120E" stroke="#FBBF24" strokeWidth="1" />
                <polygon points="0,-5 6,-1 4,5 0,7 -4,5 -6,-1" fill="#FBBF24" />
                <text x="0" y="2" fontSize="5" fontWeight="bold" fill="#15120E" textAnchor="middle">P</text>
              </g>
            ) : b.badgeType === 'hexagon' ? (
              <g>
                <polygon points="0,-8 7,-4 7,4 0,8 -7,4 -7,-4" fill="#15120E" stroke="#00C2A8" strokeWidth="1.2" />
                <text x="0" y="3" fontSize="6" fontWeight="bold" fontFamily="sans-serif" fill="#FCFAF6" textAnchor="middle">MG</text>
              </g>
            ) : b.badgeType === 'hyundai_h' ? (
              <g>
                <ellipse cx="0" cy="0" rx="9" ry="7" fill="#15120E" stroke="#00E5FF" strokeWidth="1" />
                <text x="0" y="3" fontSize="8" fontWeight="bold" fontStyle="italic" fill="#00E5FF" textAnchor="middle">H</text>
              </g>
            ) : b.badgeType === 'bmw_roundel' ? (
              <g>
                <circle cx="0" cy="0" r="8" fill="#15120E" stroke="#E4DDD2" strokeWidth="1" />
                <path d="M-6 0 A6 6 0 0 1 0 -6 L0 0 Z" fill="#2563EB" />
                <path d="M6 0 A6 6 0 0 1 0 6 L0 0 Z" fill="#2563EB" />
                <path d="M0 -6 A6 6 0 0 1 6 0 L0 0 Z" fill="#FCFAF6" />
                <path d="M0 6 A6 6 0 0 1 -6 0 L0 0 Z" fill="#FCFAF6" />
              </g>
            ) : b.badgeType === 'three_star' ? (
              <g>
                <circle cx="0" cy="0" r="8" fill="#15120E" stroke="#E4DDD2" strokeWidth="1" />
                <line x1="0" y1="0" x2="0" y2="-6" stroke="#FCFAF6" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="-5" y2="4" stroke="#FCFAF6" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="5" y2="4" stroke="#FCFAF6" strokeWidth="1.5" />
              </g>
            ) : (
              <g>
                <rect x="-14" y="-6" width="28" height="12" rx="3" fill="#15120E" stroke={b.accent} strokeWidth="1" />
                <text x="0" y="3" fontSize="7" fontWeight="bold" fontFamily="sans-serif" fill="#FCFAF6" textAnchor="middle">
                  {b.badge}
                </text>
              </g>
            )}
          </g>

          {/* 4. HIGH-PERFORMANCE TURBINE ALLOY WHEEL ASSEMBLIES */}
          {/* Front Wheel */}
          <g transform={`translate(${isSUV ? 495 : 495}, ${isSUV ? 172 : 166})`}>
            {/* Outer Tire */}
            <circle cx="0" cy="0" r={isSUV ? 34 : 30} fill="#15120E" />
            <circle cx="0" cy="0" r={isSUV ? 28 : 25} fill="url(#alloyWheelGrad)" stroke="#00C2A8" strokeWidth="2.5" />
            {/* Red / Gold Performance Caliper */}
            <path d="M-14 -12 A18 18 0 0 1 -6 -18" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
            {/* Center Cap Hub */}
            <circle cx="0" cy="0" r="9" fill="#15120E" stroke="#00C2A8" strokeWidth="1.5" />
            <text x="0" y="2.5" fontSize="5" fontWeight="bold" fill="#00E5FF" textAnchor="middle">EV</text>
            {/* Turbine Spoke Blades */}
            <line x1="-18" y1="0" x2="18" y2="0" stroke="#FCFAF6" strokeWidth="2.2" />
            <line x1="0" y1="-18" x2="0" y2="18" stroke="#FCFAF6" strokeWidth="2.2" />
            <line x1="-13" y1="-13" x2="13" y2="13" stroke="#FCFAF6" strokeWidth="2.2" />
            <line x1="-13" y1="13" x2="13" y2="-13" stroke="#FCFAF6" strokeWidth="2.2" />
          </g>

          {/* Rear Wheel */}
          <g transform={`translate(${isSUV ? 135 : 135}, ${isSUV ? 172 : 166})`}>
            <circle cx="0" cy="0" r={isSUV ? 34 : 30} fill="#15120E" />
            <circle cx="0" cy="0" r={isSUV ? 28 : 25} fill="url(#alloyWheelGrad)" stroke="#00C2A8" strokeWidth="2.5" />
            <path d="M-14 -12 A18 18 0 0 1 -6 -18" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
            <circle cx="0" cy="0" r="9" fill="#15120E" stroke="#00C2A8" strokeWidth="1.5" />
            <text x="0" y="2.5" fontSize="5" fontWeight="bold" fill="#00E5FF" textAnchor="middle">EV</text>
            <line x1="-18" y1="0" x2="18" y2="0" stroke="#FCFAF6" strokeWidth="2.2" />
            <line x1="0" y1="-18" x2="0" y2="18" stroke="#FCFAF6" strokeWidth="2.2" />
            <line x1="-13" y1="-13" x2="13" y2="13" stroke="#FCFAF6" strokeWidth="2.2" />
            <line x1="-13" y1="13" x2="13" y2="-13" stroke="#FCFAF6" strokeWidth="2.2" />
          </g>

          {/* 5. BRAND-SPECIFIC REGIONAL SMART LICENSE PLATE */}
          <g transform={`translate(${isSUV ? 555 : 558}, ${isSUV ? 152 : 148})`}>
            <rect x="0" y="0" width="40" height="13" rx="2.5" fill="#FAF9F5" stroke="#15120E" strokeWidth="1" />
            <text x="20" y="9.5" fontSize="6.5" fontWeight="900" fontFamily="monospace" fill="#145A46" textAnchor="middle">
              {b.plate}
            </text>
          </g>
        </svg>

        {/* Ambient Real-time Model Verification Badge */}
        <div className="absolute top-2 right-2 bg-[#FCFAF6]/95 backdrop-blur-xs border border-[#E4DDD2] px-3 py-1 rounded-xl text-[10px] font-mono font-bold text-[#145A46] shadow-xs flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>{brand} • {isSUV ? 'Full SUV / Crossover' : isHatch ? 'Sport Hatch' : isFastback ? 'Aero Fastback' : 'Low-Slung Performance'}</span>
        </div>
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
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-7 rounded-lg bg-[#F4F0E8] border border-[#E4DDD2] flex items-center justify-center text-[#145A46] text-[10px] font-mono font-bold flex-shrink-0">
                        {car.bodyType === 'suv_crossover' ? 'SUV' : car.bodyType === 'hatch_sport' ? 'HTCH' : 'SEDN'}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#25201A] group-hover:text-[#145A46] transition-colors flex items-center gap-1.5">
                          <span>{car.name}</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-mono">
                            {car.brand}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#5E564B] mt-0.5 block">{car.edition}</span>
                      </div>
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
      <div className="relative bg-[#FCFAF6] rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 border border-[#E4DDD2] shadow-sm overflow-hidden">
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
          {renderCarGraphic(currentCar)}
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#5E564B] mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Active Vehicle Loaded into Solver State</span>
          </div>
        </div>
      </div>

      {/* 3. BATTERY CELL HEALTH & BMS TELEMETRY GRID (WITH HOVER ICON SPIN) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="group bg-[#FCFAF6] hover:bg-[#FDFBF7] p-4 rounded-xl border border-[#E4DDD2] hover:border-[#145A46] shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-default">
          <div className="flex items-center justify-between text-[#5E564B]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-sans">State of Health (SoH)</span>
            <span className="material-symbols-outlined text-[18px] text-[#145A46] kpi-icon-spin">favorite</span>
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#145A46] mt-1">{currentCar.health}</div>
          <span className="text-[11px] text-[#5E564B] mt-1 pt-1 border-t border-[#E4DDD2]">
            Factory Degradation Cap
          </span>
        </div>

        <div className="group bg-[#FCFAF6] hover:bg-[#FDFBF7] p-4 rounded-xl border border-[#E4DDD2] hover:border-[#145A46] shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-default">
          <div className="flex items-center justify-between text-[#5E564B]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Thermal Regulation</span>
            <span className="material-symbols-outlined text-[18px] text-[#145A46] kpi-icon-spin">thermostat</span>
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#25201A] mt-1">{currentCar.temp}</div>
          <span className="text-[11px] text-[#5E564B] mt-1 pt-1 border-t border-[#E4DDD2]">
            Active Liquid Loop
          </span>
        </div>

        <div className="group bg-[#FCFAF6] hover:bg-[#FDFBF7] p-4 rounded-xl border border-[#E4DDD2] hover:border-[#145A46] shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-default">
          <div className="flex items-center justify-between text-[#5E564B]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Cell Voltage Delta</span>
            <span className="material-symbols-outlined text-[18px] text-[#145A46] kpi-icon-spin">speed</span>
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#25201A] mt-1">{currentCar.variance}</div>
          <span className="text-[11px] text-[#5E564B] mt-1 pt-1 border-t border-[#E4DDD2]">
            Balanced BMS Variance
          </span>
        </div>

        <div className="group bg-[#FCFAF6] hover:bg-[#FDFBF7] p-4 rounded-xl border border-[#E4DDD2] hover:border-[#145A46] shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-default">
          <div className="flex items-center justify-between text-[#5E564B]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Lifetime Cycles</span>
            <span className="material-symbols-outlined text-[18px] text-[#145A46] kpi-icon-spin">sync</span>
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#25201A] mt-1">{currentCar.cycles}</div>
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
