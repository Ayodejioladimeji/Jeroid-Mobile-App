import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography } from '../theme';
import { Card, Button, Input, TokenSelector, TokenPickerModal } from '../components';
import { useBalances } from '../hooks/useBalances';
import { useWithdrawalFee } from '../hooks/useWithdrawalFee';
import { useAppSelector } from '../hooks/useAppSelector';
import type { RootState } from '../store';
import type { TokenSymbol } from '../types';
import type { RootStackParamList } from '../types/navigation';
import { isValidAddress } from '../utils/validation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Withdraw'>;
type Route = RouteProp<RootStackParamList, 'Withdraw'>;

const TOKENS: TokenSymbol[] = ['ETH', 'USDT', 'DAI'];

export function WithdrawScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { top, bottom } = useSafeAreaInsets();
  const [token, setToken] = useState<TokenSymbol>('ETH');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [showTokenPicker, setShowTokenPicker] = useState(false);

  useEffect(() => {
    const scanned = route.params?.scannedAddress;
    if (scanned && isValidAddress(scanned)) setRecipient(scanned);
  }, [route.params?.scannedAddress]);

  const { data: balances } = useBalances();
  const balanceOverrides = useAppSelector((s: RootState) => s.wallet.balanceOverrides);
  const balanceMap = React.useMemo(() => {
    const m: Record<TokenSymbol, string> = { ETH: '0', USDT: '0', DAI: '0' };
    (balances ?? []).forEach((b: { symbol: TokenSymbol; balance: string }) => { m[b.symbol] = b.balance; });
    if (balanceOverrides) {
      (['ETH', 'USDT', 'DAI'] as TokenSymbol[]).forEach((s) => {
        if (balanceOverrides && balanceOverrides[s] != null) {
            m[s] = balanceOverrides[s];
          }
      });
    }
    return m;
  }, [balances, balanceOverrides]);

  const { data: feeData } = useWithdrawalFee(token, amount);

  const amountNum = parseFloat(amount) || 0;
  const balance = balanceMap[token];
  const balanceNum = parseFloat(balance) || 0;
  const insufficientBalance = amountNum > balanceNum;
  const invalidAmount = amount.trim() === '' || isNaN(amountNum) || amountNum <= 0;
  const invalidRecipient = recipient.trim() !== '' && !isValidAddress(recipient);
  const emptyRecipient = recipient.trim() === '';

  const disabledReason =
    invalidAmount
      ? 'Enter amount'
      : insufficientBalance
        ? 'Insufficient balance'
        : emptyRecipient
          ? 'Enter recipient address'
          : invalidRecipient
            ? 'Invalid address format (0x + 40 hex chars)'
            : undefined;

  const canSubmit =
    !invalidAmount &&
    !insufficientBalance &&
    !emptyRecipient &&
    !invalidRecipient &&
    feeData != null;

  const handleReview = () => {
    if (!feeData || !canSubmit) return;
    navigation.navigate('TxConfirmation', {
      type: 'withdrawal',
      payload: {
        token,
        amount,
        recipient: recipient.trim(),
        fee: feeData.fee,
        currentBalance: balance,
      },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: bottom + spacing.xxl, paddingTop: top + spacing.md, paddingHorizontal: spacing.md }]}>
      <Text style={styles.title}>Withdraw</Text>

      <Card style={styles.card}>
        <Text style={styles.label}>Token</Text>
        <TokenSelector
          symbol={token}
          balance={balance}
          onPress={() => setShowTokenPicker(true)}
        />
      </Card>

      <Input
        label="Amount"
        placeholder="0.00"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        style={{marginBottom:spacing.sm}}
      />

      {feeData && amount.trim() !== '' && (
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Estimated fee</Text>
          <Text style={styles.feeValue}>{feeData.fee} {token}</Text>
        </View>
      )}

      <View style={styles.recipientRow}>
        <Input
          label="Recipient address"
          placeholder="0x..."
          value={recipient}
          onChangeText={setRecipient}
          autoCapitalize="none"
          autoCorrect={false}
          error={invalidRecipient ? 'Invalid address (0x + 40 hex chars)' : undefined}
          containerStyle={styles.recipientInput}
        />

        <TouchableOpacity
          style={styles.scanBtn}
          onPress={() => navigation.navigate('QRScanner', { returnScreen: 'Withdraw' })}
          activeOpacity={0.8}
        >
          <Icon name="qr-code-outline" size={24} color={colors.accent} />
          <Text style={styles.scanBtnText}>Scan QR</Text>
        </TouchableOpacity>
      </View>

      <Button
        title={disabledReason ?? 'Review Withdrawal'}
        onPress={handleReview}
        disabled={!canSubmit}
        disabledReason={disabledReason}
        fullWidth
        style={styles.button}
      />

      <TokenPickerModal
        visible={showTokenPicker}
        selected={token}
        onSelect={(s) => { setToken(s); setShowTokenPicker(false); }}
        onClose={() => setShowTokenPicker(false)}
      />
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
  card: { marginBottom: spacing.md },
  label: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily,
  },
  recipientRow: { marginBottom: spacing.sm },
  recipientInput: { flex: 1, marginBottom: spacing.md },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  scanBtnText: {
    fontSize: typography.md,
    color: colors.accent,
    fontFamily: typography.fontFamilySemiBold,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  feeLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
  },
  feeValue: {
    fontSize: typography.sm,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
  },
  button: { marginTop: spacing.lg },
});
