let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function playPing(amountKAS: number, volume = 0.35) {
  const ac = getCtx();
  const now = ac.currentTime;

  const baseFreq = 220 + Math.min(amountKAS / 1000, 1) * 660;

  const osc = ac.createOscillator();
  osc.type = amountKAS > 100000 ? 'square' : 'sine';
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.4);

  const gain = ac.createGain();
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

  osc.connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.5);
}

export function playWhaleAlert(volume = 0.5) {
  const ac = getCtx();
  const now = ac.currentTime;

  for (let i = 0; i < 3; i++) {
    const t = now + i * 0.15;
    const osc = ac.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440 + i * 220, t);
    osc.frequency.exponentialRampToValueAtTime(880 + i * 220, t + 0.1);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(volume * (1 - i * 0.2), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain).connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  }
}

export function unlockAudio() {
  getCtx();
}
