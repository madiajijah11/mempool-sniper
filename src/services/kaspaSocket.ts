import type { KaspaTx, SocketStatus } from '../types/kaspa';

const KASPA_REST_URL = 'https://api.kaspa.org';
const POLL_INTERVAL = 1500;
const MAX_RECONNECT_DELAY = 30000;

type TxCallback = (tx: KaspaTx) => void;
type StatusCallback = (status: SocketStatus) => void;

let pollTimer: ReturnType<typeof setInterval> | null = null;
let reconnectAttempt = 0;
let lastSeenHashes = new Set<string>();
let statusCb: StatusCallback | null = null;
let txCb: TxCallback | null = null;
let running = false;

function somToKas(sompi: number | string): number {
  return Number(sompi) / 1e8;
}

function parseTx(raw: Record<string, unknown>): KaspaTx {
  const vd = raw.verboseData as Record<string, unknown> | undefined;
  const hash = (raw.transaction_id || raw.hash || vd?.transactionId || '') as string;
  const inputs = Array.isArray(raw.inputs) ? raw.inputs : [];
  const outputs = Array.isArray(raw.outputs) ? raw.outputs : [];

  let totalOut = 0;
  const parsedOutputs = outputs.map((o: Record<string, unknown>) => {
    const oVd = o.verboseData as Record<string, unknown> | undefined;
    const amt = somToKas(
      (o.amount as number) ??
      (oVd?.amount as number) ??
      0
    );
    totalOut += amt;
    const addr =
      (oVd?.scriptPublicKeyAddress as string) ??
      (o.script_public_key_address as string) ??
      '';
    return { address: addr as string, amount: amt };
  });

  const parsedInputs = inputs.map((i: Record<string, unknown>) => {
    const iVd = i.verboseData as Record<string, unknown> | undefined;
    return {
      address: (iVd?.address ?? '') as string,
      amount: somToKas((iVd?.amount as number) ?? 0),
    };
  });

  const fee = somToKas(
    (vd?.fee as number) ??
    (raw.fee as number) ??
    0
  );

  const ts =
    Number(vd?.blockTime ?? 0) * 1000 ||
    Date.now();

  return {
    id: hash || crypto.randomUUID(),
    hash,
    amountKAS: totalOut,
    feeKAS: fee,
    inputsCount: inputs.length,
    outputsCount: outputs.length,
    timestamp: ts,
    isWhale: false,
    inputs: parsedInputs,
    outputs: parsedOutputs,
  };
}

async function pollTransactions() {
  try {
    const res = await fetch(
      KASPA_REST_URL + '/transactions/search?limit=20',
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    const txs: Record<string, unknown>[] = Array.isArray(data) ? data : data.transactions ?? [];

    if (statusCb && reconnectAttempt > 0) {
      reconnectAttempt = 0;
      statusCb('connected');
    }
    if (statusCb && reconnectAttempt === 0) statusCb('connected');

    for (const raw of txs) {
      const parsed = parseTx(raw);
      if (lastSeenHashes.has(parsed.hash)) continue;
      lastSeenHashes.add(parsed.hash);
      if (lastSeenHashes.size > 500) {
        const iter = lastSeenHashes.values();
        for (let i = 0; i < 200; i++) iter.next();
        lastSeenHashes = new Set(Array.from(lastSeenHashes).slice(200));
      }
      txCb?.(parsed);
    }
  } catch {
    reconnectAttempt++;
    const delay = Math.min(1000 * 2 ** reconnectAttempt, MAX_RECONNECT_DELAY);
    statusCb?.('reconnecting');
    if (pollTimer) clearInterval(pollTimer);
    setTimeout(() => {
      if (running) {
        pollTimer = setInterval(pollTransactions, POLL_INTERVAL);
        pollTransactions();
      }
    }, delay);
  }
}

export function connectKaspa(onTx: TxCallback, onStatus: StatusCallback) {
  txCb = onTx;
  statusCb = onStatus;
  running = true;
  reconnectAttempt = 0;
  lastSeenHashes.clear();
  onStatus('connecting');

  pollTimer = setInterval(pollTransactions, POLL_INTERVAL);
  pollTransactions();
}

export function disconnectKaspa() {
  running = false;
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  statusCb?.('offline');
}

// ── Dev / Demo Mode Simulator ──
let simTimer: ReturnType<typeof setInterval> | null = null;

function randomHash(): string {
  const chars = '0123456789abcdef';
  let h = '';
  for (let i = 0; i < 64; i++) h += chars[Math.floor(Math.random() * 16)];
  return h;
}

function randomAddr(): string {
  return 'kaspa:q' + randomHash().slice(0, 40);
}

function generateFakeTx(): KaspaTx {
  const isWhale = Math.random() < 0.08;
  const amount = isWhale
    ? 10000 + Math.random() * 990000
    : 0.5 + Math.random() * 9999;
  const hash = randomHash();
  const outs = Math.floor(1 + Math.random() * 3);
  const ins = Math.floor(1 + Math.random() * 2);
  return {
    id: hash,
    hash,
    amountKAS: Math.round(amount * 100) / 100,
    feeKAS: Math.round(Math.random() * 0.005 * 1e6) / 1e6,
    inputsCount: ins,
    outputsCount: outs,
    timestamp: Date.now(),
    isWhale: false,
    inputs: Array.from({ length: ins }, () => ({
      address: randomAddr(),
      amount: Math.round((amount / ins) * 100) / 100,
    })),
    outputs: Array.from({ length: outs }, () => ({
      address: randomAddr(),
      amount: Math.round((amount / outs) * 100) / 100,
    })),
  };
}

export function connectSimulated(onTx: TxCallback, onStatus: StatusCallback) {
  onStatus('connected');
  simTimer = setInterval(() => {
    const batch = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < batch; i++) onTx(generateFakeTx());
  }, 600 + Math.random() * 800);
}

export function disconnectSimulated() {
  if (simTimer) {
    clearInterval(simTimer);
    simTimer = null;
  }
}
