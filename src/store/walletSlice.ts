import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TokenSymbol } from '../types';

const MOCK_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1';

export type BalanceOverrides = { [K in TokenSymbol]?: string; };

interface WalletState {
  address: string | null;
  isConnected: boolean;
  balanceOverrides: BalanceOverrides | null;
}

const initialState: WalletState = {
  address: MOCK_ADDRESS,
  isConnected: true,
  balanceOverrides: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<string | null>) => {
      state.address = action.payload;
      state.isConnected = action.payload !== null;
    },
    disconnect: (state) => {
      state.address = null;
      state.isConnected = false;
      state.balanceOverrides = null;
    },
    setBalanceOverride: (state, action: PayloadAction<{ symbol: TokenSymbol; balance: string }>) => {
      if (!state.balanceOverrides) state.balanceOverrides = {};
      state.balanceOverrides[action.payload.symbol] = action.payload.balance;
    },
    setBalanceOverridesFromApi: (state, action: PayloadAction<BalanceOverrides>) => {
      state.balanceOverrides = action.payload;
    },
  },
});

export const { setAddress, disconnect, setBalanceOverride, setBalanceOverridesFromApi } = walletSlice.actions;
export default walletSlice.reducer;
