import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography } from '../theme';
import { Card, Button, Input, TokenSelector, TokenPickerModal } from '../components';
import { useBalances } from '../hooks/useBalances';
import { useAppSelector } from '../hooks/useAppSelector';
import type { RootState } from '../store';
import { useSwapQuote } from '../hooks/useSwapQuote';
import type { TokenSymbol } from '../types';
import type { RootStackParamList } from '../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Swap'>;

export function SwapScreen() {
  const navigation = useNavigation<Nav>();
  const { top, bottom } = useSafeAreaInsets();
  const [fromToken, setFromToken] = useState<TokenSymbol>('ETH');
  const [toToken, setToToken] = useState<TokenSymbol>('USDT');
  const [amount, setAmount] = useState('');
  const [pickerFor, setPickerFor] = useState<'from' | 'to' | null>(null);

  const { data: balances } = useBalances();
  const balanceOverrides = useAppSelector((s: RootState) => s.wallet.balanceOverrides);

  const balanceMap = React.useMemo(() => {
    const m: Record<TokenSymbol, string> = { ETH: '0', USDT: '0', DAI: '0' };
    (balances ?? []).forEach((b: { symbol: TokenSymbol; balance: string }) => { m[b.symbol] = b.balance; });
    if (balanceOverrides) {
      (['ETH', 'USDT', 'DAI'] as TokenSymbol[]).forEach((s) => {
        if (balanceOverrides?.[s] != null) m[s] = balanceOverrides[s]!;
      });
    }
    return m;
  }, [balances, balanceOverrides]);

  const { data: quote, isLoading: quoteLoading } = useSwapQuote(fromToken, toToken, amount);

  const amountNum = parseFloat(amount) || 0;
  const balance = balanceMap[fromToken];
  const balanceNum = parseFloat(balance) || 0;
  const insufficientBalance = amountNum > balanceNum;
  const invalidAmount = amount.trim() === '' || isNaN(amountNum) || amountNum <= 0;
  const sameToken = fromToken === toToken;

  const disabledReason = sameToken
    ? 'Select different tokens'
    : invalidAmount
      ? 'Enter amount'
      : insufficientBalance
        ? 'Insufficient balance'
        : undefined;

  const canSubmit = !invalidAmount && !insufficientBalance && !sameToken && quote != null;

  const handleMax = () => setAmount(balance);

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const handleReview = () => {
    if (!quote || !canSubmit) return;
    navigation.navigate('TxConfirmation', {
      type: 'swap',
      payload: {
        fromToken,
        toToken,
        amountIn: amount,
        amountOut: quote.amountOut,
        rate: quote.rate,
        fromBalance: balanceMap[fromToken],
        toBalance: balanceMap[toToken],
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.swapBox}>
          <View style={styles.tokenSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Sell</Text>
              <TouchableOpacity onPress={handleMax}>
                <Text style={styles.maxText}>Use Max</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Input
                  placeholder="0.0"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  style={styles.amountInput}
                />
              </View>
              <View style={styles.selectorContainer}>
                <TokenSelector
                  symbol={fromToken}
                  balance={balance}
                  onPress={() => setPickerFor('from')}
                />
              </View>
            </View>
          </View>

          <View style={styles.switchWrapper}>
            <View style={styles.line} />
            <TouchableOpacity style={styles.switchCircle} onPress={switchTokens}>
              <Icon name="arrow-down" size={20} color={colors.accent} />
            </TouchableOpacity>
            <View style={styles.line} />
          </View>

          <View style={styles.tokenSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Buy</Text>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                {quoteLoading ? (
                  <ActivityIndicator size="small" color={colors.accent} style={styles.loader} />
                ) : (
                  <Text style={[styles.amountInput, !quote && styles.placeholderText]}>
                    {quote?.amountOut ?? '0.0'}
                  </Text>
                )}
              </View>
              <View style={styles.selectorContainer}>
                <TokenSelector
                  symbol={toToken}
                  balance={balanceMap[toToken]}
                  onPress={() => setPickerFor('to')}
                />
              </View>
            </View>
          </View>
        </View>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Exchange Rate</Text>
            <Text style={styles.infoValue}>1 {fromToken} = {quote?.rate ?? '—'} {toToken}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Slippage Tolerance</Text>
            <Text style={styles.infoValue}>0.5%</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estimated Gas</Text>
            <Text style={styles.infoValue}>$4.12</Text>
          </View>
        </Card>

        <Button
          title={disabledReason ?? 'Review Swap'}
          onPress={handleReview}
          disabled={!canSubmit}
          fullWidth
          style={styles.mainButton}
        />
      </ScrollView>

      <TokenPickerModal
        visible={pickerFor === 'from'}
        selected={fromToken}
        onSelect={(s) => { setFromToken(s); setPickerFor(null); }}
        onClose={() => setPickerFor(null)}
      />
      <TokenPickerModal
        visible={pickerFor === 'to'}
        selected={toToken}
        onSelect={(s) => { setToToken(s); setPickerFor(null); }}
        onClose={() => setPickerFor(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  swapBox: {
    gap: spacing.xs,
  },
  tokenSection: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.xs,
    fontFamily: typography.fontFamilySemiBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  maxText: {
    fontSize: typography.xs,
    fontFamily: typography.fontFamilyBold,
    color: colors.accent,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  inputContainer: {
    flex: 1,
  },
  selectorContainer: {
    flex: 1.2,
  },
  amountInput: {
    fontSize: 32,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
  },
  placeholderText: {
    color: colors.textTertiary,
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -20,
    zIndex: 2,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'transparent',
  },
  switchCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 4,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.sm,
    color: colors.textTertiary,
  },
  infoValue: {
    fontSize: typography.sm,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilySemiBold,
  },
  mainButton: {
    marginTop: spacing.md,
    height: 60,
    borderRadius: 20,
  },
  loader: { alignSelf: 'flex-start' },
});
