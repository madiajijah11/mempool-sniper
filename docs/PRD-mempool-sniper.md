# Product Requirements Document (PRD) — Mempool Sniper MVP

```json
{
  "appName": "Mempool Sniper",
  "oneLiner": "Realtime Kaspa whale & mempool radar command center with cyberpunk HUD and audio pings.",
  "targetUsers": "Kaspa traders, miners, and on-chain analysts needing instant BlockDAG flow awareness.",
  "phase": "Foundation",
  "mustHave": [
    "Direct browser WebSocket connection to Kaspa API (api.kaspa.org)",
    "Realtime live tx stream with bounded ring buffer (500 txs)",
    "Configurable whale alert threshold with visual flash and Web Audio synth pings",
    "Cyberpunk radar HUD visualization (sweep radar + live feed stream)",
    "Transaction detail inspector drawer"
  ],
  "niceToHave": [
    "Quick threshold presets (Whale 10k, Megalodon 100k, Kraken 1M KAS)",
    "Live KAS/USD price ticker badge for fiat conversions",
    "Stream pause/freeze controls",
    "Export alert history to CSV/JSON"
  ],
  "notInMvp": [
    "Wallet connectivity and private key signing",
    "Automated swap/snipe order execution",
    "Backend database and user account authentication"
  ],
  "successMetrics": [
    "Sub-100ms render latency per incoming WebSocket transaction event",
    "Zero dropped frames during high-throughput tx bursts (10-30+ BPS)",
    "100% client-side execution with zero backend infrastructure costs"
  ]
}
```

## 1. Product Overview
* **Name:** Mempool Sniper
* **Tagline:** Realtime Kaspa BlockDAG Whale & Tx Radar HUD
* **Target Audience:** Kaspa (KAS) day traders, scalpers, block explorers, on-chain analysts
* **Goal:** Provide a zero-latency, client-only mission control radar for monitoring high-value Kaspa transactions in real time.

## 2. Target Users & Personas
* **Primary Persona (The Scalper/Trader):** Needs immediate signal on large KAS transfers or exchange deposits before market price shifts.
* **Secondary Persona (The BlockDAG Watcher/Miner):** Enjoys real-time visual telemetry of Kaspa network throughput and miner reward flows.
* **Pain Points:** Standard block explorers are static, slow to refresh, table-heavy, and lack real-time sensory alerts (visual/audio) for whale-tier transactions.

## 3. Problem Statement
Kaspa operates at high block rates (1-10+ BPS), generating constant transaction volume. Traders cannot keep up with raw explorer pages to detect whale accumulation or liquidation movements. Mempool Sniper delivers a cyberpunk-themed sensory HUD that filters noise and alerts traders instantly when large transfers occur.

## 4. User Journey
1. **Landing:** User opens web app in browser; WebSocket immediately connects to `api.kaspa.org`.
2. **Configuration:** User sets or toggles alert threshold (e.g. 50,000 KAS) and enables audio.
3. **Monitoring:** Radar sweeps; live transaction bubbles/pulses render in real-time.
4. **Whale Trigger:** A 250,000 KAS tx arrives → radar flashes neon red/gold, Web Audio ping fires, tx cards highlight.
5. **Inspection:** User clicks the whale tx card to view inputs, outputs, fee, and full blockDAG transaction hash.

## 5. MVP Feature Specifications (MoSCoW)

### Must Have (P0)
* **Direct WebSocket Feed:** Resilient WebSocket connection to `api.kaspa.org` (auto-reconnect, heartbeat handling).
* **Cyberpunk Radar Canvas HUD:** Central radar sweep component visualizing txs as coordinates/blips based on amount and time.
* **Stream Table / Feed:** Clean, virtualized/bounded feed showing the latest 500 transactions (hash, amount, timestamp).
* **Alert Engine & Web Audio Synth:** Synthesizer oscillator generating procedural pings (no external audio assets required) when amount $\ge$ threshold.
* **Tx Detail Modal/Drawer:** Inspect specific transaction details with external explorer links.

### Should Have (P1)
* **Threshold Presets:** Quick buttons (Whale 10k, Megalodon 100k, Kraken 1M KAS).
* **Stream Controls:** Freeze/Pause stream button for close inspection during high volume.
* **Live Price Feed:** Fetch KAS/USD via public CoinGecko/Kaspa API to display USD value alongside KAS amounts.

### Could Have (P2)
* **Target Address Watchlist:** Highlight transactions matching user-specified Kaspa addresses.
* **Export Log:** Download triggered whale alerts as JSON or CSV.

### Won't Have (v1)
* Wallet integration / transaction signing.
* Automated trading or bot execution.
* Server-side persistence or user login.

## 6. Technical & Non-Functional Requirements
* **Architecture:** 100% Client-side SPA (Static Web App).
* **Performance:** 60 FPS radar rendering on Canvas / WebGL; efficient state management using bounded circular buffer to prevent memory leaks during prolonged sessions.
* **Audio:** Native Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`) unlocked on first user interaction.
* **Styling:** Dark cyberpunk terminal theme (neon green / cyan / amber / magenta accents, scanlines, monospace fonts).

## 7. Success Metrics
* **Latency:** < 100ms UI update upon WebSocket frame receipt.
* **Stability:** Stable memory footprint over continuous 12+ hour monitoring session.
* **Deployment:** Deployable to any static host (Vercel, Cloudflare Pages, GitHub Pages) without server dependencies.

## 8. Definition of Done
* [ ] WebSocket connection reliably consumes Kaspa transaction events.
* [ ] Radar HUD renders blips dynamically with decaying trails.
* [ ] Audio and visual alerts trigger accurately on threshold match.
* [ ] Detail drawer displays valid transaction metadata and explorer links.
* [ ] Responsive on modern desktop and tablet browsers.
