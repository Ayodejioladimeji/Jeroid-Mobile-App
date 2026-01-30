import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface ConfirmationRowProps {
  label: string;
  value: string;
}

export function ConfirmationRow({ label, value }: ConfirmationRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  label: { fontSize: typography.sm, color: colors.textSecondary, fontFamily: typography.fontFamily },
  value: { fontSize: typography.sm, color: colors.textPrimary, fontFamily: typography.fontFamilySemiBold, maxWidth: '60%' },
});
