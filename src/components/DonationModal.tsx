import { useState } from 'react';
import { X, Copy, Check, Heart, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const KASPA_DONATION_ADDR = 'kaspa:qypgw7xw60yvxv5pcjncdv4f30wanju0g64hw3204wreayajt3025qgde344ycq';

export function DonationModal({ isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  function handleCopy() {
    navigator.clipboard.writeText(KASPA_DONATION_ADDR);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#080c18] border border-amber-500/60 rounded-lg shadow-[0_0_50px_rgba(255,184,0,0.2)] overflow-hidden font-mono text-xs text-slate-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-amber-900/40 bg-[#161005]">
          <div className="flex items-center gap-2 text-amber-400">
            <Heart className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span className="font-['Orbitron'] text-sm tracking-widest uppercase font-bold text-amber-300">
              Support The Project // Donate KAS
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(255,184,0,0.3)]">
              ⚡
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-amber-300 font-['Orbitron']">
              Fuel Kaspa Mempool Sniper Development
            </h3>
            <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">
              If this radar HUD helps you catch whale movements and navigate the BlockDAG flow, consider tipping some KAS to keep serverless nodes and updates alive!
            </p>
          </div>

          {/* Address Box */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-lg p-3.5 text-left space-y-2">
            <div className="flex items-center justify-between text-[10px] text-amber-400/80 uppercase font-semibold">
              <span>Kaspa Address</span>
              <a
                href={`https://explorer.kaspa.org/addresses/${KASPA_DONATION_ADDR}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-cyan-400 hover:underline text-[10px]"
              >
                Explorer <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="p-2.5 bg-black/60 rounded border border-slate-800 font-mono text-[11px] text-amber-200 break-all select-all leading-relaxed">
              {KASPA_DONATION_ADDR}
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`w-full py-2.5 px-4 rounded font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
              copied
                ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(255,184,0,0.4)]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Address Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy KAS Address
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-amber-900/30 bg-[#100b03] text-center text-[10px] text-slate-500">
          Thank you for supporting open-source Kaspa tooling! 🚀
        </div>
      </div>
    </div>
  );
}
