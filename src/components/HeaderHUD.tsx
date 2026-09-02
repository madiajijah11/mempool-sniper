import { Activity, Radio, Volume2, VolumeX, Wifi, WifiOff, HelpCircle, Heart } from 'lucide-react';
import type { SocketStatus, StreamStats } from '../types/kaspa';

interface Props {
  status: SocketStatus;
  stats: StreamStats;
  kasPrice: number | null;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onOpenGuide: () => void;
  onOpenDonation: () => void;
}

const STATUS_COLOR: Record<SocketStatus, string> = {
  connected: 'text-green-400',
  connecting: 'text-yellow-400',
  reconnecting: 'text-amber-500',
  offline: 'text-red-500',
};

const STATUS_LABEL: Record<SocketStatus, string> = {
  connected: 'ONLINE',
  connecting: 'LINKING',
  reconnecting: 'RELINK',
  offline: 'OFFLINE',
};

export function HeaderHUD({
  status,
  stats,
  kasPrice,
  audioEnabled,
  onToggleAudio,
  onOpenGuide,
  onOpenDonation,
}: Props) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-b border-cyan-900/40 bg-[#0a0e1a]/90 backdrop-blur-md font-mono text-xs select-none shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      {/* Brand & Badge */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-['Orbitron'] text-sm tracking-widest text-cyan-300 uppercase font-bold">
              KASPA // SNIPER
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
              v1.0 HUD
            </span>
          </div>
        </div>
      </div>

      {/* Telemetry Stats */}
      <div className="flex items-center gap-4 xl:gap-6 text-slate-400 text-[11px]">
        {/* Status */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/60 border border-slate-800">
          {status === 'connected' || status === 'connecting' ? (
            <Wifi className={`w-3.5 h-3.5 ${STATUS_COLOR[status]}`} />
          ) : (
            <WifiOff className={`w-3.5 h-3.5 ${STATUS_COLOR[status]}`} />
          )}
          <span className={`font-semibold ${STATUS_COLOR[status]}`}>{STATUS_LABEL[status]}</span>
        </div>

        {/* TPS */}
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
          <span>{stats.tps} <span className="text-slate-600">TPS</span></span>
        </div>

        {/* Total TX */}
        <div className="hidden sm:block">
          TX: <span className="text-cyan-300 font-semibold">{stats.totalTx.toLocaleString()}</span>
        </div>

        {/* Total Whales */}
        <div>
          WHALES: <span className="text-amber-400 font-semibold">{stats.totalWhales}</span>
        </div>

        {/* Price */}
        {kasPrice !== null && (
          <div className="hidden md:flex items-center gap-1 text-emerald-400 bg-emerald-950/30 border border-emerald-800/30 px-2 py-0.5 rounded">
            <span>${kasPrice.toFixed(kasPrice < 1 ? 4 : 2)}</span>
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Audio Toggle */}
        <button
          onClick={onToggleAudio}
          className={`p-1.5 rounded border transition-all ${
            audioEnabled
              ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
              : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
          title={audioEnabled ? 'Audio Alerts: ON (Click to Mute)' : 'Audio Alerts: OFF (Click to Enable)'}
        >
          {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Guide Button */}
        <button
          onClick={onOpenGuide}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900/80 border border-cyan-800/40 text-cyan-400 hover:bg-cyan-950/60 hover:border-cyan-500 transition-all text-[11px] uppercase tracking-wider font-semibold"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Guide</span>
        </button>

        {/* Donation Button */}
        <button
          onClick={onOpenDonation}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/50 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 transition-all text-[11px] uppercase tracking-wider font-bold shadow-[0_0_12px_rgba(255,184,0,0.15)]"
        >
          <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40" />
          <span>Donate</span>
        </button>
      </div>
    </header>
  );
}
