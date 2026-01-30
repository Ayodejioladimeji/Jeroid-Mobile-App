import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TxLifecycleState, TxStatus, TxMeta } from '../types';

const initialState: TxLifecycleState = {
  status: 'idle',
  type: null,
  txHash: null,
  error: null,
  meta: null,
};

const txLifecycleSlice = createSlice({
  name: 'txLifecycle',
  initialState,
  reducers: {
    setValidating: (state, action: PayloadAction<{ type: TxLifecycleState['type']; meta: TxMeta | null }>) => {
      state.status = 'validating';
      state.type = action.payload.type;
      state.meta = action.payload.meta;
      state.error = null;
      state.txHash = null;
    },
    setAwaitingApproval: (state) => {
      state.status = 'awaiting_approval';
      state.error = null;
    },
    setBroadcasting: (state) => {
      state.status = 'broadcasting';
      state.error = null;
    },
    setPending: (state, action: PayloadAction<string>) => {
      state.status = 'pending';
      state.txHash = action.payload;
      state.error = null;
    },
    setSuccess: (state) => {
      state.status = 'success';
      state.error = null;
    },
    setFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    setStatus: (state, action: PayloadAction<TxStatus>) => {
      state.status = action.payload;
    },
    resetTxLifecycle: () => initialState,
  },
});

export const {
  setValidating,
  setAwaitingApproval,
  setBroadcasting,
  setPending,
  setSuccess,
  setFailed,
  setStatus,
  resetTxLifecycle,
} = txLifecycleSlice.actions;
export default txLifecycleSlice.reducer;
