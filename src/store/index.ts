import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './walletSlice';
import txLifecycleReducer from './txLifecycleSlice';
import uiReducer from './uiSlice';
import historyReducer from './historySlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    txLifecycle: txLifecycleReducer,
    ui: uiReducer,
    history: historyReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
