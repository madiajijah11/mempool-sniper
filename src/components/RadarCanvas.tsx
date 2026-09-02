import { useCallback, useEffect, useRef } from 'react';
import type { KaspaTx, RadarBlip } from '../types/kaspa';

interface Props {
  transactions: KaspaTx[];
  whaleThreshold: number;
}

const BLIP_LIFETIME = 8000;
const SWEEP_PERIOD = 3000;
const NEON_CYAN = '#00f0ff';
const BG_COLOR = 'rgba(5, 8, 17, 0.15)';

export function RadarCanvas({ transactions, whaleThreshold }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blipsRef = useRef<RadarBlip[]>([]);
  const sweepAngleRef = useRef(0);
  const prevLenRef = useRef(0);
  const rafRef = useRef(0);

  const addBlips = useCallback(
    (newTxs: KaspaTx[]) => {
      const now = Date.now();
      for (const tx of newTxs) {
        const maxLog = Math.log10(1_000_001);
        const r = Math.log10(Math.max(tx.amountKAS, 1) + 1) / maxLog;
        const theta = sweepAngleRef.current + (Math.random() - 0.5) * 0.3;
        blipsRef.current.push({
          id: tx.id,
          r: Math.min(r, 0.95),
          theta,
          amountKAS: tx.amountKAS,
          isWhale: tx.amountKAS >= whaleThreshold,
          createdAt: now,
          opacity: 1,
        });
      }
      if (blipsRef.current.length > 300) {
        blipsRef.current = blipsRef.current.slice(-300);
      }
    },
    [whaleThreshold]
  );

  useEffect(() => {
    const newCount = transactions.length - prevLenRef.current;
    if (newCount > 0 && transactions.length > 0) {
      addBlips(transactions.slice(0, Math.min(newCount, 10)));
    }
    prevLenRef.current = transactions.length;
  }, [transactions, addBlips]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      if (!running || !canvas || !ctx) return;
      const W = canvas.getBoundingClientRect().width;
      const H = canvas.getBoundingClientRect().height;
      const cx = W / 2;
      const cy = H / 2;
      const maxR = Math.min(cx, cy) * 0.92;
      const now = Date.now();

      // fade trail
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, W, H);

      // concentric rings
      for (let i = 1; i <= 4; i++) {
        const ringR = (maxR / 4) * i;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // cross hairs
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.stroke();

      // sweep line
      sweepAngleRef.current = ((now % SWEEP_PERIOD) / SWEEP_PERIOD) * Math.PI * 2;
      const sAngle = sweepAngleRef.current;
      const sx = cx + Math.cos(sAngle) * maxR;
      const sy = cy + Math.sin(sAngle) * maxR;

      const grad = ctx.createLinearGradient(cx, cy, sx, sy);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      grad.addColorStop(1, 'rgba(0, 240, 255, 0.6)');
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.stroke();

      // sweep arc glow
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, sAngle - 0.4, sAngle);
      ctx.closePath();
      const arcGrad = ctx.createConicGradient(sAngle - 0.4, cx, cy);
      arcGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      arcGrad.addColorStop(1, 'rgba(0, 240, 255, 0.07)');
      ctx.fillStyle = arcGrad;
      ctx.fill();

      // blips
      const alive: RadarBlip[] = [];
      for (const b of blipsRef.current) {
        const age = now - b.createdAt;
        if (age > BLIP_LIFETIME) continue;
        b.opacity = 1 - age / BLIP_LIFETIME;
        alive.push(b);

        const bx = cx + Math.cos(b.theta) * b.r * maxR;
        const by = cy + Math.sin(b.theta) * b.r * maxR;
        const baseSize = b.isWhale ? 5 : 2.5;

        if (b.isWhale) {
          // pulsing glow
          const pulse = 1 + Math.sin(now / 150) * 0.3;
          ctx.beginPath();
          ctx.arc(bx, by, baseSize * 3 * pulse * b.opacity, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 0, 127, ${0.15 * b.opacity})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(bx, by, baseSize * pulse, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 184, 0, ${b.opacity})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(255, 0, 127, ${b.opacity})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // label
          if (b.opacity > 0.3) {
            ctx.font = '9px "JetBrains Mono", monospace';
            ctx.fillStyle = `rgba(255, 184, 0, ${b.opacity})`;
            ctx.fillText(`${(b.amountKAS / 1000).toFixed(0)}K`, bx + 8, by - 4);
          }
        } else {
          ctx.beginPath();
          ctx.arc(bx, by, baseSize * b.opacity, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(57, 255, 20, ${0.7 * b.opacity})`;
          ctx.fill();
        }
      }
      blipsRef.current = alive;

      // center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = NEON_CYAN;
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-[#050811] rounded-lg border border-cyan-900/30"
      style={{ imageRendering: 'auto' }}
    />
  );
}
