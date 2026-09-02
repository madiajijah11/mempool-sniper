import type { KaspaTx } from '../types/kaspa';

interface Props {
  transactions: KaspaTx[];
  kasPrice: number | null;
  onSelectTx: (tx: KaspaTx) => void;
}

function formatAmount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toFixed(2);
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 2) return 'now';
  if (s < 60) return s + 's';
  return Math.floor(s / 60) + 'm';
}

export function TxStreamList({ transactions, kasPrice, onSelectTx }: Props) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-3 py-1.5 border-b border-cyan-900/30 flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-wider">
        <span>Live transaction feed</span>
        <span className="text-cyan-600">{transactions.length} buffered</span>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {transactions.slice(0, 100).map((tx) => (
          <button
            key={tx.id}
            onClick={() => onSelectTx(tx)}
            className={`w-full text-left px-3 py-1.5 border-b border-slate-800/40 hover:bg-cyan-900/10 transition-colors flex items-center gap-2 text-xs font-mono group ${
              tx.isWhale ? 'bg-amber-950/20 border-l-2 border-l-amber-500' : ''
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              tx.isWhale ? 'bg-amber-400 shadow-[0_0_6px_rgba(255,184,0,0.6)]' : 'bg-cyan-600/60'
            }`} />
            <span className="text-slate-500 truncate w-20 flex-shrink-0">
              {tx.hash.slice(0, 8)}...
            </span>
            <span className={`flex-shrink-0 font-semibold ${
              tx.isWhale ? 'text-amber-400' : 'text-cyan-300'
            }`}>
              {formatAmount(tx.amountKAS)} KAS
            </span>
            {kasPrice !== null && (
              <span className="text-slate-600 text-[10px]">
                ${(tx.amountKAS * kasPrice).toFixed(2)}
              </span>
            )}
            <span className="ml-auto text-slate-600 text-[10px]">
              {timeAgo(tx.timestamp)}
            </span>
            {tx.isWhale && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 uppercase tracking-wider">
                whale
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
