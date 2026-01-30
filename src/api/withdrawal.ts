import type { WithdrawalFeeResponse } from '../types';
import type { TokenSymbol } from '../types';

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_FEE = '0.001';

export async function fetchWithdrawalFee(token: TokenSymbol, amount: string): Promise<WithdrawalFeeResponse> {
  await delay(300);
  const amt = parseFloat(amount) || 0;
  const fee = parseFloat(MOCK_FEE);
  return {
    fee: MOCK_FEE,
    total: (amt + fee).toFixed(6),
  };
}

export async function executeWithdrawal(
  token: TokenSymbol,
  amount: string,
  recipient: string
): Promise<string> {
  await delay(1200);
  const hash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return hash;
}
