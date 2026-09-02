import { useEffect, useState } from 'react';
import type { KaspaTx } from '../types/kaspa';

interface Props {
  tx: KaspaTx | null;
}

export function WhaleAlertBanner({ tx }: Props) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<KaspaTx | null>(null);

  useEffect(() => {
    if (!tx) return;
    setCurrent(tx);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, [tx]);

  if (!visible || !current) return null;

  const amtStr = current.amountKAS >= 1_000_000
    ? (current.amountKAS / 1_000_000).toFixed(2) + 'M'
    : (current.amountKAS / 1_000).toFixed(1) + 'K';

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 animate-pulse">
      <div className="bg-gradient-to-r from-amber-950/90 via-red-950/90 to-amber-950/90 border border-amber-500/60 rounded-lg px-6 py-3 shadow-2xl shadow-amber-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-3 font-mono">
          <span className="text-2xl">🐋</span>
          <div>
            <div className="text-amber-400 font-['Orbitron'] text-sm tracking-wider uppercase">
              Whale Detected
            </div>
            <div className="text-amber-200 text-xs mt-0.5">
              {amtStr} KAS — {current.hash.slice(0, 12)}...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
