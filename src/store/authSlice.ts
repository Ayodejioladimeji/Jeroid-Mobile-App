import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isUnlocked: boolean;
  passcodeSet: boolean;
  failedAttempts: number;
  lastUnlockedAt: number | null;
}

const initialState: AuthState = {
  isUnlocked: false,
  passcodeSet: false,
  failedAttempts: 0,
  lastUnlockedAt: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUnlocked: (state, action: PayloadAction<boolean>) => {
      state.isUnlocked = action.payload;
      if (action.payload) {
        state.lastUnlockedAt = Date.now();
        state.failedAttempts = 0;
      } else {
        state.lastUnlockedAt = null;
      }
    },
    setPasscodeSet: (state, action: PayloadAction<boolean>) => {
      state.passcodeSet = action.payload;
    },
    incrementFailedAttempts: state => {
      state.failedAttempts++;
    },
    resetFailedAttempts: state => {
      state.failedAttempts = 0;
    },
    setLastUnlockedAt: (state, action: PayloadAction<number | null>) => {
      state.lastUnlockedAt = action.payload;
    },
    resetAuth: state => {
      state.isUnlocked = false;
      state.failedAttempts = 0;
      state.lastUnlockedAt = null;
    },
  },
});

export const { setUnlocked, setPasscodeSet, incrementFailedAttempts, resetFailedAttempts, setLastUnlockedAt, resetAuth } = authSlice.actions;
export default authSlice.reducer;
