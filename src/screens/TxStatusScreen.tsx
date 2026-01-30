import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation, RouteProp, CommonActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import { colors, spacing, typography } from '../theme';
import { Card, Button, TxStatusBadge } from '../components';
import { useQueryClient } from '@tanstack/react-query';
import type { RootStackParamList } from '../types/navigation';
import { balancesQueryKey } from '../api/balances';
import { truncateHash } from '../utils/formatting';

type Route = RouteProp<RootStackParamList, 'TxStatus'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'TxStatus'>;

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValueText}>{value}</Text>
    </View>
  );
}

export function TxStatusScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const { top, bottom } = useSafeAreaInsets();
  const { record } = route.params;

  const isSuccess = record.status === 'success';
  const isFailed = record.status === 'failed';
  const isPending = record.status === 'pending';

  const copyHash = () => {
    if (record.txHash) {
      Clipboard.setString(record.txHash);
      Toast.show({ type: 'success', text1: 'Tx hash copied' });
    }
  };

  const handleDone = () => {
    if (isSuccess) queryClient.invalidateQueries({ queryKey: balancesQueryKey });
    
    navigation.dispatch(
      CommonActions.navigate({
        name: 'MainTabs',
        params: {
          screen: 'Dashboard',
        },
      })
    );
  };

  const handleRetry = () => {
    if (record.type === 'swap') navigation.navigate('Swap');
    else navigation.navigate('Withdraw', {});
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: top + spacing.xl, paddingBottom: bottom + spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[
            styles.statusCircle,
            isSuccess && { backgroundColor: colors.successMuted },
            isFailed && { backgroundColor: colors.errorMuted },
            isPending && { backgroundColor: colors.backgroundTertiary }
          ]}>
            <Icon
              name={isSuccess ? "checkmark-circle" : isFailed ? "close-circle" : "time"}
              size={64}
              color={isSuccess ? colors.success : isFailed ? colors.error : colors.textSecondary}
            />
          </View>
          <Text style={styles.title}>
            {isSuccess ? 'Transaction Confirmed' : isFailed ? 'Transaction Failed' : 'Processing...'}
          </Text>
          <TxStatusBadge status={record.status} />
        </View>

        <Card style={styles.receiptCard}>
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Total Value</Text>
            <Text style={styles.amountValue}>
              {record.amount} {record.token}
            </Text>
            {record.amountSecondary != null && (
              <View style={styles.swapArrowRow}>
                <Icon name="arrow-down" size={14} color={colors.textTertiary} />
                <Text style={styles.secondaryValue}>
                  {record.amountSecondary} {record.tokenSecondary}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.detailList}>
            <DetailRow label="Type" value={record.type === 'swap' ? 'Token Swap' : 'Withdrawal'} />

            {record.txHash && (
              <TouchableOpacity onPress={copyHash} style={styles.hashTouchable}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Transaction Hash</Text>
                  <View style={styles.hashBox}>
                    <Text style={styles.hashText}>{truncateHash(record.txHash)}</Text>
                    <Icon name="copy-outline" size={14} color={colors.accent} />
                  </View>
                </View>
              </TouchableOpacity>
            )}

            <DetailRow
              label="Date & Time"
              value={new Date(record.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            />

            {record.error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorLabel}>Error Details</Text>
                <Text style={styles.errorText}>{record.error}</Text>
              </View>
            )}
          </View>
        </Card>

        <View style={styles.footer}>
          <Button
            title="Done"
            onPress={handleDone}
            variant="primary"
            fullWidth
            style={styles.button}
          />
          {isFailed && (
            <Button
              title="Retry Transaction"
              onPress={handleRetry}
              variant="secondary"
              fullWidth
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  statusCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.xl,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBold,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  receiptCard: {
    width: '100%',
    padding: spacing.xl,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  amountLabel: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  amountValue: {
    fontSize: 28,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBold,
  },
  swapArrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  secondaryValue: {
    fontSize: typography.md,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilySemiBold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    width: '100%',
    marginVertical: spacing.lg,
    borderStyle: 'dashed',
    borderRadius: 1,
  },
  detailList: {
    width: '100%',
    gap: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
  },
  detailValueText: {
    fontSize: typography.sm,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilySemiBold,
  },
  hashTouchable: {
    paddingVertical: 4,
  },
  hashBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    gap: spacing.xs,
  },
  hashText: {
    fontSize: typography.xs,
    color: colors.accent,
    fontFamily: typography.fontFamilySemiBold,
  },
  errorContainer: {
    marginTop: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.errorMuted,
    borderRadius: 12,
  },
  errorLabel: {
    fontSize: 10,
    color: colors.error,
    fontFamily: typography.fontFamilyBold,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  errorText: {
    fontSize: typography.xs,
    color: colors.error,
    fontFamily: typography.fontFamily,
  },
  footer: {
    width: '100%',
    marginTop: spacing.xxl,
  },
  button: {
    marginBottom: spacing.md,
    height: 56,
    borderRadius: 16,
  },
});
