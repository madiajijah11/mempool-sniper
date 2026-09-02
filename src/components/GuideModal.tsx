import { X, HelpCircle, Volume2, ShieldAlert, Compass, Eye } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#080c18] border border-cyan-500/50 rounded-lg shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden font-mono text-xs text-slate-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-900/40 bg-[#0a0f24]">
          <div className="flex items-center gap-2 text-cyan-400">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="font-['Orbitron'] text-sm tracking-widest uppercase font-bold">
              Mission Control // Operator Guide
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-thin">
          {/* Section 1 */}
          <div className="bg-slate-900/50 border border-cyan-900/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>1. Reading the Radar Canvas</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              The central radar maps incoming Kaspa transactions in real-time onto polar coordinates:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300 text-[11px]">
              <li><strong className="text-cyan-300">Distance from Center (Radius):</strong> Logarithmic scaling based on KAS value. Micro-transfers sit near the core ($r \to 0$); mega whale transfers light up the outer perimeters ($r \to 1$).</li>
              <li><strong className="text-cyan-300">Angle & Sweep:</strong> Blips appear at the current scanner angle upon arrival with decaying phosphor trails.</li>
              <li><strong className="text-green-400">Green Dots:</strong> Standard network transactions.</li>
              <li><strong className="text-amber-400">Pulsing Gold / Neon Rings:</strong> Whale transactions exceeding your configured threshold.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-900/50 border border-cyan-900/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-300 font-semibold mb-2">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>2. Audio Synthesizer & Web Audio Alerts</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Zero external MP3 audio files needed. Procedural sound waves are generated in real-time:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300 text-[11px]">
              <li>Click the <Volume2 className="w-3 h-3 inline text-cyan-400 mx-1" /> icon in the top HUD to unlock browser audio context.</li>
              <li>Whale pings modulate oscillator pitch and decay duration based on transfer size.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-900/50 border border-cyan-900/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-magenta-300 font-semibold mb-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>3. Threshold Presets & Inspection</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Use the top control toolbar to switch between quick thresholds:
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
              <div className="bg-black/40 p-2 rounded border border-slate-800">
                <span className="text-cyan-300 font-bold">1K - 10K KAS:</span> Dolphin / active flow.
              </div>
              <div className="bg-black/40 p-2 rounded border border-slate-800">
                <span className="text-amber-400 font-bold">50K - 100K KAS:</span> Shark / large movement.
              </div>
              <div className="bg-black/40 p-2 rounded border border-slate-800">
                <span className="text-rose-400 font-bold">1M KAS:</span> Kraken / Whale-tier transfer.
              </div>
              <div className="bg-black/40 p-2 rounded border border-slate-800">
                <span className="text-emerald-400 font-bold">Freeze Button:</span> Pauses incoming feed to inspect hashes.
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-900/50 border border-cyan-900/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>4. Transaction Details & Block Explorer</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Click any transaction card on the right-hand stream feed to open the deep inspection drawer, displaying input addresses, output splits, miner fees, and one-click direct links to <span className="text-cyan-400">explorer.kaspa.org</span>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-cyan-900/40 bg-[#0a0f24] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs tracking-wider uppercase font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
