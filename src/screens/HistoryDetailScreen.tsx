import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';
import { Card, TxStatusBadge, DetailRow } from '../components';
import type { RootStackParamList } from '../types/navigation';


type Route = RouteProp<RootStackParamList, 'HistoryDetail'>;

export function HistoryDetailScreen() {
  const route = useRoute<Route>();
  const { top, bottom } = useSafeAreaInsets();
  const { record } = route.params;

  const typeLabel = record.type === 'swap' ? 'Swap' : 'Withdrawal';
  const amountLabel =
    record.type === 'swap' && record.amountSecondary != null
      ? `${record.amount} ${record.token} → ${record.amountSecondary} ${record.tokenSecondary}`
      : `${record.amount} ${record.token}`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: bottom + spacing.xxl, paddingTop: top + spacing.md, paddingHorizontal: spacing.md }]}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.type}>{typeLabel}</Text>
          <TxStatusBadge status={record.status} />
        </View>
        <Text style={styles.amount}>{amountLabel}</Text>
        <Text style={styles.time}>{new Date(record.timestamp).toLocaleString()}</Text>
      </Card>

      <Card style={styles.card}>
        <DetailRow label="Amount" value={`${record.amount} ${record.token}`} />
        {record.type === 'swap' && record.amountSecondary != null && (
          <DetailRow label="Received" value={`${record.amountSecondary} ${record.tokenSecondary}`} />
        )}
        {record.recipient && <DetailRow label="Recipient" value={record.recipient} copyable />}
        {record.fee && <DetailRow label="Fee" value={`${record.fee} ${record.token}`} />}
        {record.txHash && <DetailRow label="Transaction hash" value={record.txHash} copyable />}
        {record.error && <DetailRow label="Error" value={record.error} />}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {},
  card: { marginBottom: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  type: { fontSize: typography.lg, color: colors.textPrimary, fontFamily: typography.fontFamilyBold },
  amount: { fontSize: typography.xl, color: colors.textPrimary, fontFamily: typography.fontFamilySemiBold, marginBottom: spacing.xs },
  time: { fontSize: typography.sm, color: colors.textTertiary, fontFamily: typography.fontFamily },
});
