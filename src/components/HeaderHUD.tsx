import { Activity, Radio, Volume2, VolumeX, Wifi, WifiOff } from 'lucide-react';
import type { SocketStatus, StreamStats } from '../types/kaspa';

interface Props {
  status: SocketStatus;
  stats: StreamStats;
  kasPrice: number | null;
  audioEnabled: boolean;
  onToggleAudio: () => void;
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

export function HeaderHUD({ status, stats, kasPrice, audioEnabled, onToggleAudio }: Props) {
  return (
    <header className="flex items-center justify-between gap-4 px-4 py-2 border-b border-cyan-900/40 bg-[#0a0e1a]/80 backdrop-blur-sm font-mono text-xs select-none">
      <div className="flex items-center gap-3">
        <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span className="font-['Orbitron'] text-sm tracking-widest text-cyan-300 uppercase">
          Mempool Sniper
        </span>
      </div>

      <div className="flex items-center gap-6 text-slate-400">
        <div className="flex items-center gap-1.5">
          {status === 'connected' || status === 'connecting' ? (
            <Wifi className={`w-3.5 h-3.5 ${STATUS_COLOR[status]}`} />
          ) : (
            <WifiOff className={`w-3.5 h-3.5 ${STATUS_COLOR[status]}`} />
          )}
          <span className={STATUS_COLOR[status]}>{STATUS_LABEL[status]}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-500" />
          <span>{stats.tps} <span className="text-slate-600">TPS</span></span>
        </div>

        <span>
          TX: <span className="text-cyan-300">{stats.totalTx.toLocaleString()}</span>
        </span>

        <span>
          WHALES: <span className="text-amber-400">{stats.totalWhales}</span>
        </span>

        {kasPrice !== null && (
          <span>
            KAS/USD: <span className="text-green-400">${kasPrice.toFixed(kasPrice < 1 ? 4 : 2)}</span>
          </span>
        )}

        <button
          onClick={onToggleAudio}
          className="p-1 rounded hover:bg-cyan-900/30 transition-colors"
          title={audioEnabled ? 'Mute audio alerts' : 'Enable audio alerts'}
        >
          {audioEnabled ? (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
}
