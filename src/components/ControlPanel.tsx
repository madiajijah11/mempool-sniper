interface Props {
  threshold: number;
  onThresholdChange: (val: number) => void;
  paused: boolean;
  onTogglePause: () => void;
}

const PRESETS = [
  { label: '1K', value: 1_000 },
  { label: '10K', value: 10_000 },
  { label: '50K', value: 50_000 },
  { label: '100K', value: 100_000 },
  { label: '1M', value: 1_000_000 },
];

export function ControlPanel({ threshold, onThresholdChange, paused, onTogglePause }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-cyan-900/30 bg-[#0a0e1a]/60 font-mono text-xs">
      <span className="text-slate-500 uppercase tracking-wider mr-1">Whale &ge;</span>
      <input
        type="number"
        value={threshold}
        onChange={(e) => onThresholdChange(Math.max(0, Number(e.target.value)))}
        className="w-24 bg-slate-900/80 border border-cyan-800/40 rounded px-2 py-1 text-cyan-300 focus:outline-none focus:border-cyan-500 text-right"
      />
      <span className="text-slate-600">KAS</span>

      <div className="flex gap-1 ml-2">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            onClick={() => onThresholdChange(p.value)}
            className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
              threshold === p.value
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800/60 text-slate-400 hover:bg-cyan-900/40 hover:text-cyan-300'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      <button
        onClick={onTogglePause}
        className={`px-3 py-1 rounded text-[10px] uppercase tracking-wider transition-colors ${
          paused
            ? 'bg-amber-600/80 text-white'
            : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60'
        }`}
      >
        {paused ? '▶ Resume' : '⏸ Freeze'}
      </button>
    </div>
  );
}
