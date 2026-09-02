import { X, ExternalLink, Copy } from 'lucide-react';
import type { KaspaTx } from '../types/kaspa';

interface Props {
  tx: KaspaTx | null;
  kasPrice: number | null;
  onClose: () => void;
}

function formatKAS(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

export function TxDetailDrawer({ tx, kasPrice, onClose }: Props) {
  if (!tx) return null;

  const explorerUrl = `https://explorer.kaspa.org/txs/${tx.hash}`;

  function copyHash() {
    navigator.clipboard.writeText(tx!.hash);
  }

  const usdValue = kasPrice ? (tx.amountKAS * kasPrice).toFixed(2) : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0a0e1a] border-l border-cyan-800/40 shadow-2xl shadow-cyan-900/20 overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-cyan-900/30 bg-[#0a0e1a]/95 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="font-['Orbitron'] text-xs text-cyan-400 uppercase tracking-wider">
              TX Detail
            </span>
            {tx.isWhale && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 uppercase">
                whale
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="p-4 space-y-4 font-mono text-xs">
          {/* Hash */}
          <div>
            <label className="text-slate-500 uppercase text-[10px] tracking-wider">Transaction Hash</label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-cyan-300 break-all text-[11px] leading-relaxed flex-1">{tx.hash}</span>
              <button onClick={copyHash} className="p-1 hover:bg-slate-800 rounded flex-shrink-0" title="Copy">
                <Copy className="w-3.5 h-3.5 text-slate-500" />
              </button>
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer"
                className="p-1 hover:bg-slate-800 rounded flex-shrink-0" title="View on Explorer">
                <ExternalLink className="w-3.5 h-3.5 text-cyan-500" />
              </a>
            </div>
          </div>

          {/* Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/60 rounded-lg p-3 border border-cyan-900/20">
              <label className="text-slate-500 uppercase text-[10px]">Amount</label>
              <div className={`text-lg font-semibold mt-1 ${tx.isWhale ? 'text-amber-400' : 'text-cyan-300'}`}>
                {formatKAS(tx.amountKAS)} <span className="text-[10px] text-slate-500">KAS</span>
              </div>
              {usdValue && <div className="text-slate-500 text-[10px] mt-0.5">${usdValue} USD</div>}
            </div>
            <div className="bg-slate-900/60 rounded-lg p-3 border border-cyan-900/20">
              <label className="text-slate-500 uppercase text-[10px]">Fee</label>
              <div className="text-lg font-semibold mt-1 text-slate-300">
                {formatKAS(tx.feeKAS)} <span className="text-[10px] text-slate-500">KAS</span>
              </div>
            </div>
          </div>

          {/* IO */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/60 rounded-lg p-3 border border-cyan-900/20">
              <label className="text-slate-500 uppercase text-[10px]">Inputs</label>
              <div className="text-lg font-semibold mt-1 text-slate-200">{tx.inputsCount}</div>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-3 border border-cyan-900/20">
              <label className="text-slate-500 uppercase text-[10px]">Outputs</label>
              <div className="text-lg font-semibold mt-1 text-slate-200">{tx.outputsCount}</div>
            </div>
          </div>

          {/* Output addresses */}
          <div>
            <label className="text-slate-500 uppercase text-[10px] tracking-wider">Outputs</label>
            <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto">
              {tx.outputs.map((o, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-900/40 rounded px-2 py-1.5 text-[10px]">
                  <span className="text-slate-400 truncate max-w-[200px]">{o.address || '—'}</span>
                  <span className="text-cyan-300 flex-shrink-0 ml-2">{formatKAS(o.amount)} KAS</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inputs */}
          {tx.inputs.length > 0 && (
            <div>
              <label className="text-slate-500 uppercase text-[10px] tracking-wider">Inputs</label>
              <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto">
                {tx.inputs.map((inp, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-900/40 rounded px-2 py-1.5 text-[10px]">
                    <span className="text-slate-400 truncate max-w-[200px]">{inp.address || '—'}</span>
                    <span className="text-slate-300 flex-shrink-0 ml-2">{formatKAS(inp.amount)} KAS</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="text-slate-600 text-[10px] pt-2 border-t border-cyan-900/20">
            {new Date(tx.timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
