export type TokenSymbol = 'ETH' | 'USDT' | 'DAI';

export interface Token {
  symbol: TokenSymbol;
  name: string;
  decimals: number;
}

export interface TokenBalance {
  symbol: TokenSymbol;
  balance: string;
  balanceFormatted: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
}

export type TxStatus =
  | 'idle'
  | 'validating'
  | 'awaiting_approval'
  | 'broadcasting'
  | 'pending'
  | 'success'
  | 'failed';

export type TxType = 'swap' | 'withdrawal';

export interface TxLifecycleState {
  status: TxStatus;
  type: TxType | null;
  txHash: string | null;
  error: string | null;
  meta: TxMeta | null;
}

export type TxMeta =
  | { type: 'swap'; fromToken: TokenSymbol; toToken: TokenSymbol; amountIn: string; amountOut: string }
  | { type: 'withdrawal'; token: TokenSymbol; amount: string; recipient: string; fee: string };

export interface TransactionRecord {
  id: string;
  type: TxType;
  status: TxStatus;
  amount: string;
  amountSecondary?: string;
  token: TokenSymbol;
  tokenSecondary?: TokenSymbol;
  recipient?: string;
  txHash?: string;
  fee?: string;
  error?: string;
  timestamp: number;
}

export interface SwapForm {
  fromToken: TokenSymbol;
  toToken: TokenSymbol;
  amount: string;
}

export interface WithdrawalForm {
  token: TokenSymbol;
  amount: string;
  recipient: string;
}

export interface BalancesResponse {
  balances: TokenBalance[];
  updatedAt: number;
}

export interface SwapQuoteResponse {
  amountOut: string;
  rate: string;
  fee: string;
}

export interface WithdrawalFeeResponse {
  fee: string;
  total: string;
}
