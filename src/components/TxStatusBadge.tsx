import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';
import type { TxStatus } from '../types';

const LABELS: Record<TxStatus, string> = {
  idle: 'Idle',
  validating: 'Validating',
  awaiting_approval: 'Awaiting Approval',
  broadcasting: 'Broadcasting',
  pending: 'Pending',
  success: 'Success',
  failed: 'Failed',
};

const STATUS_COLORS: Record<TxStatus, string> = {
  idle: colors.textTertiary,
  validating: colors.info,
  awaiting_approval: colors.warning,
  broadcasting: colors.info,
  pending: colors.warning,
  success: colors.success,
  failed: colors.error,
};

interface TxStatusBadgeProps {
  status: TxStatus;
}

export function TxStatusBadge({ status }: TxStatusBadgeProps) {
  const bg = status === 'success' ? colors.successMuted : status === 'failed' ? colors.errorMuted : colors.backgroundTertiary;
  const textColor = STATUS_COLORS[status];

  return (
    <View style={[styles.badge]}>
      <Text style={[styles.text, { color: textColor }]}>{LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 25,
    alignSelf: 'flex-start',
    borderWidth:0.5,
    borderColor:colors.border
  },
  text: {
    fontSize: typography.xs,
    fontFamily: typography.fontFamilySemiBold,
  },
});
