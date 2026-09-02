# Technical Design Document (TechDesign) — Mempool Sniper MVP

```json
{
  "appName": "Mempool Sniper",
  "stack": {
    "frontend": "React 19 / Vite / TypeScript",
    "backend": "None (Direct Browser WebSocket to api.kaspa.org)",
    "database": "In-Memory Circular Buffer + LocalStorage",
    "auth": "None",
    "styling": "Tailwind CSS (Cyberpunk Dark HUD)",
    "deployment": "Vercel / Cloudflare Pages / Static Hosting"
  },
  "commands": {
    "setup": "pnpm install",
    "dev": "pnpm run dev",
    "test": "pnpm run test",
    "typecheck": "pnpm run typecheck",
    "lint": "pnpm run lint",
    "build": "pnpm run build"
  },
  "aiScope": "none"
}
```

## 1. System Architecture Overview
Client-only Single Page Application (SPA). The browser connects directly to Kaspa's public WebSocket / SSE endpoint, parses transaction / blockDAG broadcast messages, filters by transaction value, updates a high-performance 2D Canvas radar, and synthesizes audio alerts via the native Web Audio API.

```
+-------------------------------------------------------------------------+
|                              Browser (SPA)                              |
|                                                                         |
|  +-----------------------+       +-----------------------------------+  |
|  | Kaspa WS Stream Hook  | ----> | In-Memory Ring Buffer (500 items) |  |
|  +-----------------------+       +-----------------------------------+  |
|              |                                     |                    |
|              v                                     v                    |
|  +-----------------------+       +-----------------------------------+  |
|  | Whale Filter Engine   | ----> | 2D Canvas Radar Sweep HUD         |  |
|  +-----------------------+       +-----------------------------------+  |
|              |                                     |                    |
|              v                                     v                    |
|  +-----------------------+       +-----------------------------------+  |
|  | Web Audio Synth Ping  |       | Virtualized Stream & Detail Modal |  |
|  +-----------------------+       +-----------------------------------+  |
+-------------------------------------------------------------------------+
                                    ^
                                    | WebSocket (WSS)
                                    v
                     [ wss://api.kaspa.org / Kaspa Node ]
```

## 2. Tech Stack Selection
* **Framework:** React 19 + TypeScript + Vite (ultra-fast HMR, lean bundle size).
* **Styling:** Tailwind CSS v4 with custom neon palette (cyan `#00f0ff`, neon green `#39ff14`, amber `#ffb800`, magenta `#ff007f`, deep dark `#050811`).
* **Visual Graphics:** HTML5 2D Canvas (`requestAnimationFrame` radar sweep with fading particle blips).
* **Audio:** Web Audio API native oscillator (sine / square waves, configurable pitch & decay).
* **Icons:** `lucide-react`.
* **State Management:** Lightweight React state + direct ref access for high-frequency 60 FPS Canvas rendering to prevent React re-render thrashing.

## 3. Data Flow & Streaming Architecture
1. **WebSocket Ingestion:**
   * Endpoint: `wss://api.kaspa.org/ws` or public Kaspa node WebSocket endpoint.
   * Subscription: Subscribe to `last-transactions` / `block-added` events.
   * Auto-reconnect with exponential backoff on drop.
2. **Buffer & Filtering:**
   * Incoming raw tx is normalized: `{ id, hash, amountKAS, feeKAS, inputsCount, outputsCount, timestamp, isWhale }`.
   * Pushed into a fixed-size ring buffer array (max 500 items).
   * If `amountKAS >= alertThreshold`, trigger Whale Alert event.
3. **Whale Alert Dispatcher:**
   * Dispatches visual banner / badge trigger.
   * Plays Web Audio ping sound (if user audio enabled).
   * Spawns an animated radar blip at calculated polar coordinates $(r, \theta)$.

## 4. Cyberpunk Radar Canvas Engine
* **Coordinate Mapping:**
  * Distance from center $r$: Scaled logarithmically based on transaction value ($1\text{ KAS} \to 1{,}000{,}000\text{ KAS}$).
  * Angle $\theta$: Increments with current sweep angle at moment of arrival.
* **Rendering Loop:**
  * Background clear with low alpha (`rgba(5, 8, 17, 0.2)`) to create natural phosphor trail decay.
  * Sweep line rotation ($360^\circ$ every 3 seconds).
  * Blip rendering: Normal txs = subtle cyan/green dots; Whale txs = glowing pulsing rings with text label.

## 5. UI Layout & Component Breakdown
* **Top Bar / HUD Header:**
  * Live status indicator (Connected / Reconnecting / Offline).
  * TPS (Transactions Per Second) / BPS counter.
  * KAS/USD live price badge.
  * Audio toggle & volume slider.
* **Main Center Viewport:**
  * Interactive Radar Canvas (center).
  * Quick threshold presets bar: [10K KAS] [50K KAS] [100K KAS] [1M KAS] + Custom input.
* **Side Stream Panel (Right / Bottom):**
  * Live streaming transaction feed (table / cards).
  * Whale badges with highlight animation.
  * Click-to-inspect opens Tx Detail Drawer.
* **Tx Detail Drawer:**
  * Tx Hash with copy button & explorer link (`explorer.kaspa.org/txs/...`).
  * Inputs / Outputs breakdown.
  * Fee & Gas metrics.

## 6. Directory Structure Plan
```
mempool-sniper/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── kaspa.ts
│   ├── services/
│   │   ├── kaspaSocket.ts
│   │   ├── audioSynth.ts
│   │   └── priceFeed.ts
│   ├── components/
│   │   ├── HeaderHUD.tsx
│   │   ├── RadarCanvas.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── TxStreamList.tsx
│   │   ├── TxDetailDrawer.tsx
│   │   └── WhaleAlertBanner.tsx
│   └── hooks/
│       ├── useKaspaStream.ts
│       └── useAudioAlert.ts
└── docs/
    ├── PRD-mempool-sniper.md
    └── TechDesign-mempool-sniper.md
```

## 7. Performance & Memory Budget
* **Memory ceiling:** < 50MB runtime memory (ensured by 500-tx bounded array).
* **Frame rate:** 60 FPS Canvas render using independent animation loop decoupled from React render cycle.
* **Network resilience:** Zero CPU overhead when offline / reconnecting.
