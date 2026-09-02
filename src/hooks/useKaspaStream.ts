import { useCallback, useEffect, useRef, useState } from 'react';
import type { KaspaTx, SocketStatus, StreamStats } from '../types/kaspa';
import { connectKaspa, disconnectKaspa, connectSimulated, disconnectSimulated } from '../services/kaspaSocket';

const BUFFER_SIZE = 500;
const USE_SIMULATOR = true; // flip to false for live Kaspa API

export function useKaspaStream(whaleThreshold: number) {
  const [transactions, setTransactions] = useState<KaspaTx[]>([]);
  const [status, setStatus] = useState<SocketStatus>('offline');
  const [paused, setPaused] = useState(false);
  const [stats, setStats] = useState<StreamStats>({
    tps: 0,
    totalTx: 0,
    totalWhales: 0,
    connectionUptime: 0,
  });

  const bufferRef = useRef<KaspaTx[]>([]);
  const tpsCounterRef = useRef(0);
  const totalRef = useRef(0);
  const whalesRef = useRef(0);
  const pausedRef = useRef(false);
  const connectTimeRef = useRef(0);
  const onWhaleRef = useRef<((tx: KaspaTx) => void) | null>(null);

  pausedRef.current = paused;

  const handleTx = useCallback(
    (tx: KaspaTx) => {
      if (pausedRef.current) return;
      tx.isWhale = tx.amountKAS >= whaleThreshold;
      if (tx.isWhale) {
        whalesRef.current++;
        onWhaleRef.current?.(tx);
      }
      totalRef.current++;
      tpsCounterRef.current++;

      bufferRef.current = [tx, ...bufferRef.current].slice(0, BUFFER_SIZE);
      setTransactions([...bufferRef.current]);
    },
    [whaleThreshold]
  );

  useEffect(() => {
    connectTimeRef.current = Date.now();

    if (USE_SIMULATOR) {
      connectSimulated(handleTx, setStatus);
    } else {
      connectKaspa(handleTx, setStatus);
    }

    const statsInterval = setInterval(() => {
      setStats({
        tps: tpsCounterRef.current,
        totalTx: totalRef.current,
        totalWhales: whalesRef.current,
        connectionUptime: Math.floor((Date.now() - connectTimeRef.current) / 1000),
      });
      tpsCounterRef.current = 0;
    }, 1000);

    return () => {
      clearInterval(statsInterval);
      if (USE_SIMULATOR) disconnectSimulated();
      else disconnectKaspa();
    };
  }, [handleTx]);

  const setOnWhale = useCallback((cb: (tx: KaspaTx) => void) => {
    onWhaleRef.current = cb;
  }, []);

  return { transactions, status, stats, paused, setPaused, setOnWhale };
}
