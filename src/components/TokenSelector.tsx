import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';
import type { TokenSymbol } from '../types';

const TOKEN_NAMES: Record<TokenSymbol, string> = {
  ETH: 'Ethereum',
  USDT: 'Tether',
  DAI: 'Dai',
};

interface TokenSelectorProps {
  symbol: TokenSymbol;
  balance?: string;
  onPress: () => void;
  label?: string;
}

export function TokenSelector({ symbol, balance, onPress, label }: TokenSelectorProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.8}>
      <View>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <Text style={styles.symbol}>{symbol}</Text>
        {balance !== undefined ? (
          <Text style={styles.balance}>Bal: {balance}</Text>
        ) : null}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily,
  },
  symbol: {
    fontSize: typography.lg,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilySemiBold,
  },
  balance: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily,
  },
  chevron: {
    fontSize: 24,
    color: colors.textSecondary,
  },
});
