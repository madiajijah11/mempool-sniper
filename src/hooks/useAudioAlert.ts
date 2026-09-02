import { useCallback, useRef, useState } from 'react';
import { playPing, playWhaleAlert, unlockAudio } from '../services/audioSynth';

export function useAudioAlert() {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const enabledRef = useRef(false);

  const toggleAudio = useCallback(() => {
    setAudioEnabled((prev) => {
      const next = !prev;
      enabledRef.current = next;
      if (next) unlockAudio();
      return next;
    });
  }, []);

  const triggerPing = useCallback((amountKAS: number) => {
    if (!enabledRef.current) return;
    playPing(amountKAS);
  }, []);

  const triggerWhaleAlert = useCallback(() => {
    if (!enabledRef.current) return;
    playWhaleAlert();
  }, []);

  return { audioEnabled, toggleAudio, triggerPing, triggerWhaleAlert };
}
