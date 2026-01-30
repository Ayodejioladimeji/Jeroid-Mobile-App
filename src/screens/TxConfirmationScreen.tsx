import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { colors, spacing, typography } from '../theme';
import { historyQueryKey } from '../hooks/useHistory';
import { Card, Button, ConfirmationRow } from '../components';
import { useAppDispatch } from '../hooks/useAppDispatch';
import {
  setValidating,
  setAwaitingApproval,
  setBroadcasting,
  setPending,
  setSuccess,
  setFailed,
  resetTxLifecycle,
} from '../store/txLifecycleSlice';
import { addTransaction } from '../store/historySlice';
import { setBalanceOverride } from '../store/walletSlice';
import { executeSwap } from '../api/swap';
import { executeWithdrawal } from '../api/withdrawal';
import { appendTransaction } from '../api/history';
import type { RootStackParamList } from '../types/navigation';
import type { TransactionRecord, TokenSymbol } from '../types';
import { generateId } from '../utils/formatting';

type Nav = NativeStackNavigationProp<RootStackParamList, 'TxConfirmation'>;
type Route = RouteProp<RootStackParamList, 'TxConfirmation'>;

export function TxConfirmationScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { top, bottom } = useSafeAreaInsets();
  const { type, payload } = route.params;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (type === 'swap' && 'fromToken' in payload) {
      dispatch(setValidating({ type: 'swap', meta: { type: 'swap', fromToken: payload.fromToken as TokenSymbol, toToken: payload.toToken as TokenSymbol, amountIn: payload.amountIn, amountOut: payload.amountOut } }));
      dispatch(setAwaitingApproval());
      await new Promise<void>((resolve) => setTimeout(resolve, 500));
      dispatch(setBroadcasting());
      try {
        const txHash = await executeSwap(
          payload.fromToken as TokenSymbol,
          payload.toToken as TokenSymbol,
          payload.amountIn,
          payload.amountOut
        );
        dispatch(setPending(txHash));
        const record: TransactionRecord = {
          id: generateId(),
          type: 'swap',
          status: 'pending',
          amount: payload.amountIn,
          amountSecondary: payload.amountOut,
          token: payload.fromToken as TokenSymbol,
          tokenSecondary: payload.toToken as TokenSymbol,
          txHash,
          timestamp: Date.now(),
        };
        if (payload.fromBalance != null) {
          const newFrom = (parseFloat(payload.fromBalance) - parseFloat(payload.amountIn)).toFixed(6);
          dispatch(setBalanceOverride({ symbol: payload.fromToken as TokenSymbol, balance: newFrom }));
        }
        if (payload.toBalance != null) {
          const newTo = (parseFloat(payload.toBalance) + parseFloat(payload.amountOut)).toFixed(6);
          dispatch(setBalanceOverride({ symbol: payload.toToken as TokenSymbol, balance: newTo }));
        }
        dispatch(addTransaction(record));
        await appendTransaction(record);
        queryClient.invalidateQueries({ queryKey: historyQueryKey });
        dispatch(setSuccess());
        navigation.replace('TxStatus', { record: { ...record, status: 'success' } });
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Swap failed';
        dispatch(setFailed(msg));
        const record: TransactionRecord = {
          id: generateId(),
          type: 'swap',
          status: 'failed',
          amount: payload.amountIn,
          token: payload.fromToken as TokenSymbol,
          error: msg,
          timestamp: Date.now(),
        };
        dispatch(addTransaction(record));
        await appendTransaction(record);
        queryClient.invalidateQueries({ queryKey: historyQueryKey });
        navigation.replace('TxStatus', { record });
      } finally {
        dispatch(resetTxLifecycle());
        setIsSubmitting(false);
      }
    } else if (type === 'withdrawal' && 'recipient' in payload) {
      dispatch(setValidating({ type: 'withdrawal', meta: { type: 'withdrawal', token: payload.token as TokenSymbol, amount: payload.amount, recipient: payload.recipient, fee: payload.fee } }));
      dispatch(setAwaitingApproval());
      await new Promise<void>((resolve) => setTimeout(resolve, 500));
      dispatch(setBroadcasting());
      try {
        const txHash = await executeWithdrawal(
          payload.token as TokenSymbol,
          payload.amount,
          payload.recipient
        );
        if (payload.currentBalance != null) {
          const newBalance = (parseFloat(payload.currentBalance) - parseFloat(payload.amount)).toFixed(6);
          dispatch(setBalanceOverride({ symbol: payload.token as TokenSymbol, balance: newBalance }));
        }
        dispatch(setPending(txHash));
        const record: TransactionRecord = {
          id: generateId(),
          type: 'withdrawal',
          status: 'pending',
          amount: payload.amount,
          token: payload.token as TokenSymbol,
          recipient: payload.recipient,
          fee: payload.fee,
          txHash,
          timestamp: Date.now(),
        };
        dispatch(addTransaction(record));
        await appendTransaction(record);
        queryClient.invalidateQueries({ queryKey: historyQueryKey });
        dispatch(setSuccess());
        navigation.replace('TxStatus', { record: { ...record, status: 'success' } });
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Withdrawal failed';
        dispatch(setFailed(msg));
        const record: TransactionRecord = {
          id: generateId(),
          type: 'withdrawal',
          status: 'failed',
          amount: payload.amount,
          token: payload.token as TokenSymbol,
          recipient: payload.recipient,
          error: msg,
          timestamp: Date.now(),
        };
        dispatch(addTransaction(record));
        await appendTransaction(record);
        queryClient.invalidateQueries({ queryKey: historyQueryKey });
        navigation.replace('TxStatus', { record });
      } finally {
        dispatch(resetTxLifecycle());
        setIsSubmitting(false);
      }
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: bottom + spacing.xxl, paddingTop: top + spacing.md, paddingHorizontal: spacing.md }]}>
      <Text style={styles.title}>Confirm</Text>

      <Card style={styles.card}>
        {type === 'swap' && 'fromToken' in payload && (
          <>
            <ConfirmationRow label="From" value={`${payload.amountIn} ${payload.fromToken}`} />
            <ConfirmationRow label="To" value={`${payload.amountOut} ${payload.toToken}`} />
            <ConfirmationRow label="Rate" value={`1 ${payload.fromToken} = ${payload.rate} ${payload.toToken}`} />
          </>
        )}
        {type === 'withdrawal' && 'recipient' in payload && (
          <>
            <ConfirmationRow label="Amount" value={`${payload.amount} ${payload.token}`} />
            <ConfirmationRow label="Recipient" value={payload.recipient.slice(0, 10) + '...' + payload.recipient.slice(-8)} />
            <ConfirmationRow label="Network fee" value={`${payload.fee} ${payload.token}`} />
          </>
        )}
      </Card>

      <Button title="Confirm" onPress={handleConfirm} variant="primary" fullWidth style={styles.button} loading={isSubmitting} disabled={isSubmitting} />
      <Button title="Cancel" onPress={() => navigation.goBack()} variant="ghost" fullWidth />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {},
  title: {
    fontSize: typography.xxl,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBold,
    marginBottom: spacing.lg,
  },
  card: { marginBottom: spacing.lg },
  button: { marginBottom: spacing.md },
});
