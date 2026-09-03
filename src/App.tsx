import { useCallback, useEffect, useState } from 'react';
import type { KaspaTx } from './types/kaspa';
import { useKaspaStream } from './hooks/useKaspaStream';
import { useAudioAlert } from './hooks/useAudioAlert';
import { fetchKaspaPrice } from './services/priceFeed';
import { HeaderHUD } from './components/HeaderHUD';
import { ControlPanel } from './components/ControlPanel';
import { RadarCanvas } from './components/RadarCanvas';
import { TxStreamList } from './components/TxStreamList';
import { TxDetailDrawer } from './components/TxDetailDrawer';
import { WhaleAlertBanner } from './components/WhaleAlertBanner';
import { GuideModal } from './components/GuideModal';
import { DonationModal } from './components/DonationModal';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [whaleThreshold, setWhaleThreshold] = useState(10_000);
  const [kasPrice, setKasPrice] = useState<number | null>(null);
  const [selectedTx, setSelectedTx] = useState<KaspaTx | null>(null);
  const [lastWhale, setLastWhale] = useState<KaspaTx | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);

  const { transactions, status, stats, paused, setPaused, setOnWhale } = useKaspaStream(whaleThreshold);
  const { audioEnabled, toggleAudio, triggerWhaleAlert } = useAudioAlert();

  const handleWhale = useCallback(
    (tx: KaspaTx) => {
      setLastWhale({ ...tx });
      triggerWhaleAlert();
    },
    [triggerWhaleAlert]
  );

  useEffect(() => {
    setOnWhale(handleWhale);
  }, [setOnWhale, handleWhale]);

  useEffect(() => {
    fetchKaspaPrice().then(setKasPrice);
    const iv = setInterval(() => fetchKaspaPrice().then(setKasPrice), 60_000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#050811]">
      {/* Scanline & ambient grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.1) 2px, rgba(0,240,255,0.1) 4px)',
        }}
      />

      <HeaderHUD
        status={status}
        stats={stats}
        kasPrice={kasPrice}
        audioEnabled={audioEnabled}
        onToggleAudio={toggleAudio}
        onOpenGuide={() => setGuideOpen(true)}
        onOpenDonation={() => setDonationOpen(true)}
      />

      <ControlPanel
        threshold={whaleThreshold}
        onThresholdChange={setWhaleThreshold}
        paused={paused}
        onTogglePause={() => setPaused(!paused)}
      />

      <WhaleAlertBanner tx={lastWhale} />

      <div className="flex flex-1 overflow-hidden">
        {/* Radar Center Command Viewport */}
        <div className="flex-1 p-3 min-w-0 flex flex-col">
          <div className="flex-1 relative">
            <RadarCanvas transactions={transactions} whaleThreshold={whaleThreshold} />
          </div>
        </div>

        {/* Live Stream Panel */}
        <div className="w-80 xl:w-96 border-l border-cyan-900/30 bg-[#080c18]/90 flex-shrink-0 flex flex-col">
          <TxStreamList
            transactions={transactions}
            kasPrice={kasPrice}
            onSelectTx={setSelectedTx}
          />
        </div>
      </div>

      {/* Tx Detail Drawer */}
      <TxDetailDrawer
        tx={selectedTx}
        kasPrice={kasPrice}
        onClose={() => setSelectedTx(null)}
      />

      {/* Operator Guide Modal */}
      <GuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
      />

      {/* Donation Modal */}
      <DonationModal
        isOpen={donationOpen}
        onClose={() => setDonationOpen(false)}
      />

      <Analytics />
    </div>
  );
}
