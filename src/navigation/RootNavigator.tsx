import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, typography } from '../theme';
import { TabNavigator } from './TabNavigator';
import { SwapScreen } from '../screens/SwapScreen';
import { WithdrawScreen } from '../screens/WithdrawScreen';
import { TxConfirmationScreen } from '../screens/TxConfirmationScreen';
import { TxStatusScreen } from '../screens/TxStatusScreen';
import { HistoryDetailScreen } from '../screens/HistoryDetailScreen';
import { QRScannerScreen } from '../screens/QRScannerScreen';
import type { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.textPrimary,
  headerTitleStyle: { fontFamily: typography.fontFamilySemiBold, fontSize: typography.lg },
  contentStyle: { backgroundColor: colors.background },
  animation: 'slide_from_right' as const,
};

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.error,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={AppTheme}>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Swap" component={SwapScreen} options={{ title: 'Swap' }} />
        <Stack.Screen name="Withdraw" component={WithdrawScreen} options={{ title: 'Withdraw' }} />
        <Stack.Screen name="TxConfirmation" component={TxConfirmationScreen} options={{ title: 'Confirm' }} />
        <Stack.Screen name="TxStatus" component={TxStatusScreen} options={{ title: 'Transaction', headerLeft: () => null }} />
        <Stack.Screen name="HistoryDetail" component={HistoryDetailScreen} options={{ title: 'Transaction Details' }} />
        <Stack.Screen name="QRScanner" component={QRScannerScreen} options={{ title: 'Scan QR Code' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
