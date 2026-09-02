export interface KaspaTx {
  id: string;
  hash: string;
  amountKAS: number;
  feeKAS: number;
  inputsCount: number;
  outputsCount: number;
  timestamp: number;
  isWhale: boolean;
  inputs: TxIO[];
  outputs: TxIO[];
}

export interface TxIO {
  address: string;
  amount: number;
}

export interface RadarBlip {
  id: string;
  r: number;
  theta: number;
  amountKAS: number;
  isWhale: boolean;
  createdAt: number;
  opacity: number;
}

export type SocketStatus = 'connecting' | 'connected' | 'reconnecting' | 'offline';

export interface WhaleAlert {
  tx: KaspaTx;
  triggeredAt: number;
}

export interface StreamStats {
  tps: number;
  totalTx: number;
  totalWhales: number;
  connectionUptime: number;
}
