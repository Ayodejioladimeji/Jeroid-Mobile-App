import type { TokenBalance, TokenSymbol } from '../types';

const TOKENS: TokenSymbol[] = ['ETH', 'USDT', 'DAI'];

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

function mockBalances(): TokenBalance[] {
  const base: Record<TokenSymbol, string> = {
    ETH: '2.45',
    USDT: '1250.00',
    DAI: '890.50',
  };
  const jitter = () => (Math.random() * 0.01).toFixed(4);
  return TOKENS.map((symbol) => ({
    symbol,
    balance: (parseFloat(base[symbol]) + parseFloat(jitter())).toFixed(6),
    balanceFormatted: base[symbol],
  }));
}

export async function fetchBalances(): Promise<TokenBalance[]> {
  await delay(800);
  return mockBalances();
}

export const balancesQueryKey = ['balances'] as const;
