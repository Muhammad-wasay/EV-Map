---
name: Kinetic Horizon
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#3c4a46'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#6c7a76'
  outline-variant: '#bbcac4'
  surface-tint: '#006b5c'
  primary: '#006b5c'
  on-primary: '#ffffff'
  primary-container: '#00c2a8'
  on-primary-container: '#00493e'
  inverse-primary: '#41ddc2'
  secondary: '#0058bc'
  on-secondary: '#ffffff'
  secondary-container: '#0070eb'
  on-secondary-container: '#fefcff'
  tertiary: '#006c49'
  on-tertiary: '#ffffff'
  tertiary-container: '#28c38a'
  on-tertiary-container: '#004a31'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#65fade'
  primary-fixed-dim: '#41ddc2'
  on-primary-fixed: '#00201b'
  on-primary-fixed-variant: '#005045'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a41'
  on-secondary-fixed-variant: '#004493'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system establishes a calm, hyper-focused mobility interface engineered for electric vehicle navigation and long-range route planning. Merging the intuitive spatial ergonomics of premier ride-hailing platforms with the disciplined spatial clarity of modern cartography, the aesthetic eliminates range anxiety through radical reduction of telemetry clutter.

Key attributes:
- **Atmospheric Clarity**: Visual layers remain breathable and airy, avoiding high-density instrumentation panels in favor of glanceable contextual intelligence.
- **Human-Centric Fluidity**: Touch targets, bottom sheets, and route pills prioritize one-handed automotive reachability and effortless route alterations.
- **Luminescent Energy**: Electric cyan and turquoise signals communicate state of charge, connector availability, and optimized velocity vectors without overwhelming the viewport.

## Colors
The palette balances radiant clean surfaces with high-energy luminous accents. 

- **Primary (`#00C2A8`)**: Electric turquoise reserved for live route trajectories, active battery replenishment stages, and primary affirmative actions.
- **Secondary (`#007AFF`)**: Rapid-transit blue utilized for system guidance waypoints, auxiliary charger networks, and standard interactive links.
- **Tertiary (`#10B981`)**: Pure regenerative emerald highlighting ultra-fast charging speeds (150kW+), optimal battery health zones, and eco-routing efficiency metrics.
- **Neutral (`#1E293B`)**: Deep slate foundation providing high-contrast legibility against off-white canvas backgrounds (`#F8FAFC` base surface) while preventing the glare associated with absolute pitch blacks.

In low-light situations, the canvas inverts to an obsidian slate ground (`#0B0F17`) where the primary electric accents illuminate with soft, controlled self-glow boundaries.

## Typography
Plus Jakarta Sans was selected for its geometric purity, wide apertures, and friendly, modern human-centric curves. Its tall x-height and open counters guarantee immediate legibility during rapid glance cycles while operating a vehicle.

- Large numerical figures (such as Battery State of Charge `%` and Remaining Kilometers) use `display-lg` with tabular lining figures to maintain anchored alignment during dynamic updates.
- Secondary navigational sub-labels and charger wattage ratings utilize `label-md` and `label-sm` with slight uppercase tracking to maintain separation from standard body text.

## Layout & Spacing
The layout employs an ambient viewport architecture where the interactive vector map fills 100% of the canvas. Interface modules sit as detached floating planes above the map ground.

- **Mobile (< 768px)**: Floating top search pill anchored 16px below status safe-area; bottom trip sheet operates with progressive disclosure (collapsed 72px peek bar, half-sheet 40% height, full route breakdown 85% height).
- **Tablet / In-Dash Screens (768px - 1024px)**: Left-anchored trip management dock measuring 380px fixed width, floating 20px off viewport perimeter with 16px internal guttering.
- **Desktop / Wide Cockpit Displays (> 1024px)**: Dual modular columns with a 420px primary planning rail on the left and an auxiliary charger inspection card floating on the top right.

## Elevation & Depth
Depth is realized through ambient diffusion and subtle glassmorphic shielding rather than abrupt hard drops:

- **Level 0 (Map Floor)**: The baseline canvas displaying vector cartography, topography, and real-time transit paths.
- **Level 1 (Floating Chips & HUD Markers)**: Casts an ultra-wide, low-opacity shadow (`0 4px 20px -2px rgba(15, 23, 42, 0.06)`) combined with a translucent glass background (`rgba(255, 255, 255, 0.88)` with `backdrop-filter: blur(12px)`) and a whisper-thin outline (`border: 1px solid rgba(255, 255, 255, 0.6)`).
- **Level 2 (Trip Sheets & Action Drawers)**: High-altitude suspension (`0 12px 32px -4px rgba(15, 23, 42, 0.1)`) preventing map features from visually competing with primary actions.
- **Level 3 (Modal Alerts & Charger Stall Overlays)**: Focused focal plane (`0 20px 48px -6px rgba(15, 23, 42, 0.16)`) framed by a gentle dimmed scrim (`rgba(15, 23, 42, 0.2)`).

## Shapes
A pill-shaped curvature standard governs the visual ecosystem, echoing automotive aerodynamic form factors and the organic ergonomics of modern ride-hailing products.

- **Micro elements (Badges, Buttons, Chips)**: Pure circular or pill radii (`9999px`) provide tactile, touch-friendly affordances.
- **Floating Containers (Cards, Overlays)**: `rounded-lg` (2rem / 32px) curvature creates continuous, soft perimeter framing that separates clean UI elements from underlying angular road geometries.
- **Sheet Corners**: Mobile bottom sheets feature a 32px top-left and top-right radius with a centered 4x36mm grab handle pill.

## Components

### Buttons
- **Primary Route CTA**: Full-width or expansive pill (`h-14`), solid vibrant turquoise (`#00C2A8`) with crisp white typography (`label-lg`), devoid of heavy inner gradients.
- **Floating Map Controls**: Pure circles (`48x48px` or `56x56px`), translucent white base with central iconography rendered in deep slate (`#1E293B`).

### Chips & Filters
- Compact pills (`h-9`, `px-4`) highlighting charging speeds ("150 kW+", "Free Now", "Tesla Supercharger"). Inactive state features an off-white surface with hairline border; active state fills with electric cyan or turquoise accompanied by a small status indicator dot.

### Trip Summary Sheet
- Detached floating surface resting 16px above the display bottom edge.
- Visual elements feature a large arrival time display, remaining battery percentage chip with color-coded safety margins, total distance, and a single high-priority "Start Route" button.
- Clean sequential milestone list displaying charging stops with estimated replenishment duration ("22 min to 80%").

### Charger Pin Markers
- Pill-shaped map markers containing stall count and charging power: an emerald badge denotes available high-speed units, amber indicates high occupancy, and grey represents inactive stalls.

### Input Fields
- Floating search bar spanning the top screen zone: pill-shaped enclosure (`h-13`), left-aligned search icon, ghost text placeholder, and voice navigation icon right-aligned. Contains zero harsh border lines, relying entirely on Level 1 ambient elevation.