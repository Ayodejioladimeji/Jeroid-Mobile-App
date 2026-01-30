import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TransactionRecord } from '../types';

interface HistoryState {
  transactions: TransactionRecord[];
}

const initialState: HistoryState = {
  transactions: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<TransactionRecord>) => {
      state.transactions.unshift(action.payload);
    },
    setTransactions: (state, action: PayloadAction<TransactionRecord[]>) => {
      state.transactions = action.payload;
    },
    updateTransaction: (state, action: PayloadAction<{ id: string; updates: Partial<TransactionRecord> }>) => {
      const idx = state.transactions.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) {
        state.transactions[idx] = { ...state.transactions[idx], ...action.payload.updates };
      }
    },
  },
});

export const { addTransaction, setTransactions, updateTransaction } = historySlice.actions;
export default historySlice.reducer;
