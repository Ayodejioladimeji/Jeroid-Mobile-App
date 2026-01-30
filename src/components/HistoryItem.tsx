import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography } from '../theme';
import { Card, TxStatusBadge } from './index';
import type { TransactionRecord } from '../types';

interface HistoryItemProps {
  item: TransactionRecord;
  onPress: () => void;
}

export function HistoryItem({ item, onPress }: HistoryItemProps) {
  const isSwap = item.type === 'swap';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.wrapper}>
      <Card style={styles.card}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: colors.backgroundTertiary }]}>
            <Icon
              name={isSwap ? "swap-horizontal" : "arrow-up-outline"}
              size={18}
              color={isSwap ? colors.accent : colors.textPrimary}
            />
          </View>
        </View>

        <View style={styles.info}>
          <View style={styles.headerRow}>
            <Text style={styles.typeText}>{isSwap ? 'Swap' : 'Withdraw'}</Text>
            <TxStatusBadge status={item.status} />
          </View>

          <Text style={styles.amountText} numberOfLines={1}>
            {isSwap && item.amountSecondary != null
              ? `${item.amount} ${item.token} → ${item.amountSecondary}`
              : `${item.amount} ${item.token}`}
          </Text>

          <Text style={styles.dateText}>
            {new Date(item.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
          </Text>
        </View>

        <Icon name="chevron-forward" size={16} color={colors.textTertiary} />
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: { marginRight: spacing.md },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:5,
    marginBottom: 4,
  },
  typeText: {
    fontSize: typography.sm,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
  },
  amountText: {
    fontSize: typography.md,
    fontFamily: typography.fontFamilySemiBold,
    color: colors.textPrimary,
  },
  dateText: {
    fontSize: 12,
    color: colors.textTertiary,
    fontFamily: typography.fontFamily,
    marginTop: 2,
  },
});
