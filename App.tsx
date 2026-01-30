import React, { useEffect, useRef } from 'react';
import { StatusBar, AppState, AppStateStatus } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { store, RootState } from './src/store';
import BootSplash from "react-native-bootsplash";
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme';
import { AuthGate } from './src/components';
import { useAppSelector, useAppDispatch } from './src/hooks';
import { setUnlocked } from './src/store/authSlice';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

function AppContent() {
  const dispatch = useAppDispatch();
  const { isUnlocked, lastUnlockedAt } = useAppSelector((state: RootState) => state.auth);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const init = async () => {
    };

    init().finally(async () => {
      BootSplash.hide({ fade: true });
      console.log("BootSplash has been hidden successfully");
    });
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        const now = Date.now();
        if (lastUnlockedAt && (now - lastUnlockedAt > INACTIVITY_TIMEOUT)) {
          dispatch(setUnlocked(false));
        }
      } else if (nextAppState === 'background') {
        dispatch(setUnlocked(false));
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [dispatch, lastUnlockedAt]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {isUnlocked ? <RootNavigator /> : <AuthGate />}
      <Toast />
    </>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <AppContent />
          </SafeAreaProvider>
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
