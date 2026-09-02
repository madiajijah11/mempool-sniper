# AGENTS.md — Mempool Sniper MVP

## Project Overview
* **Name:** Mempool Sniper
* **Type:** Realtime Kaspa Whale & Mempool Radar Command Center (SPA)
* **Architecture:** Client-only React 19 + TypeScript + Vite + Tailwind CSS + HTML5 Canvas + Web Audio API.
* **Backend:** None (Direct browser WebSocket to Kaspa public endpoints `wss://api.kaspa.org/ws` / REST fallback).
* **PRD:** `docs/PRD-mempool-sniper.md`
* **Tech Design:** `docs/TechDesign-mempool-sniper.md`

## Commands & Workflows
* **Install:** `pnpm install` (or `npm install`)
* **Dev Server:** `pnpm run dev`
* **Typecheck:** `pnpm run typecheck`
* **Build:** `pnpm run build`

## Build Phases

### Phase 1: Foundation & Project Scaffolding
- [ ] Initialize Vite + React + TypeScript configuration.
- [ ] Configure Tailwind CSS with Cyberpunk dark theme variables and neon palette.
- [ ] Define Kaspa TypeScript types (`KaspaTx`, `WhaleAlert`, `RadarBlip`, `SocketStatus`).
- [ ] Create base shell layout (HUD header, radar viewport, stream feed container).

### Phase 2: Live Stream & Kaspa Integration
- [ ] Implement `kaspaSocket.ts` service for resilient WebSocket streaming with auto-reconnect.
- [ ] Implement simulated / fallback tx generator for offline / test / dev sandbox modes.
- [ ] Implement bounded in-memory ring buffer hook (`useKaspaStream`) with TPS / BPS telemetry.
- [ ] Fetch live KAS/USD exchange rate via CoinGecko / Kaspa REST API.

### Phase 3: Cyberpunk Radar HUD (Canvas 2D)
- [ ] Build `RadarCanvas.tsx` with 60 FPS `requestAnimationFrame` loop.
- [ ] Implement sweeping radar line ($360^\circ$ rotation) with logarithmic distance mapping for KAS amounts.
- [ ] Render decaying phosphor trails and glowing particle blips for transactions.
- [ ] Add pulsing wave effects and neon alerts for whale-tier transactions.

### Phase 4: Audio Synth Alert System
- [ ] Implement `audioSynth.ts` using native Web Audio API (procedural sine/square chirp generator).
- [ ] Add user audio permission banner / toggle.
- [ ] Implement sound trigger thresholds with frequency scaling based on transaction size.

### Phase 5: Stream Feed, Whale Controls & Detail Drawer
- [ ] Build `ControlPanel.tsx` with whale threshold slider and quick presets (10k, 50k, 100k, 1M KAS).
- [ ] Build `TxStreamList.tsx` with neon whale badges, pause/freeze toggle, and live tx counter.
- [ ] Build `TxDetailDrawer.tsx` modal showing transaction hash, inputs/outputs, fee, and explorer links.
- [ ] Polish responsive HUD aesthetics (scanline overlay, glowing borders, monospace typography).

## Code Standards & Conventions
- Minimal abstractions: Inline logic when clear, single file per cohesive component.
- Zero extra dependencies: Pure Web Audio API for sound; Pure 2D Canvas for radar.
- Memory safety: Ensure circular buffer cap (500 items) and clean up interval / animation frames on unmount.
