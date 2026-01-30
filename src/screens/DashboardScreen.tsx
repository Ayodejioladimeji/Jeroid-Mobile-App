import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography } from '../theme';
import { Card, AddressWithCopy, DashboardSkeleton, ErrorWithRetry, DashboardTopBar, ActionItem } from '../components';
import { useAppSelector, useAppDispatch } from '../hooks';
import type { RootState } from '../store';
import type { TokenBalance } from '../types';
import { useBalances } from '../hooks/useBalances';
import { balancesQueryKey } from '../api/balances';
import { setBalanceOverridesFromApi } from '../store/walletSlice';
import type { BalanceOverrides } from '../store/walletSlice';
import type { RootStackParamList } from '../types/navigation';
import Toast from 'react-native-toast-message';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { top, bottom } = useSafeAreaInsets();
  const address = useAppSelector((s: RootState) => s.wallet.address);
  const balanceOverrides = useAppSelector((s: RootState) => s.wallet.balanceOverrides);
  const { data: balances, isLoading, isRefetching, refetch, isError, error } = useBalances();

  useEffect(() => {
    if (balances && balances.length > 0) {
      const overrides: BalanceOverrides = {};
      balances.forEach((b) => {
        overrides[b.symbol] = b.balance;
      });
      dispatch(setBalanceOverridesFromApi(overrides));
    }
  }, [balances, dispatch]);

  const effectiveBalances: TokenBalance[] = React.useMemo(() => {
    if (!balances) return [];
    return balances.map((b) => ({
      ...b,
      balance: balanceOverrides?.[b.symbol] ?? b.balance,
      balanceFormatted: balanceOverrides?.[b.symbol] ?? b.balanceFormatted,
    }));
  }, [balances, balanceOverrides]);

  const totalValuation = "$12,450.00";

  const onRefresh = () => refetch();

  const comingSoon = () => {
    Toast.show({ type: 'info', text1: 'Coming Soon...' });
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <DashboardTopBar />
        <ErrorWithRetry
          message={error?.message ?? 'Failed to load balances'}
          onRetry={() => queryClient.invalidateQueries({ queryKey: balancesQueryKey })}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: top }}>
        <DashboardTopBar />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: bottom + spacing.xl }]}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
      >
        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <View style={styles.heroSection}>
              <Text style={styles.heroLabel}>Total Assets</Text>
              <Text style={styles.heroAmount}>{totalValuation}</Text>
              <View style={styles.heroTrend}>
                <Icon name="trending-up" size={16} color={colors.accent} />
                <Text style={styles.heroTrendText}>+2.4% past 24h</Text>
              </View>
            </View>

            <View style={styles.actionGrid}>
              <ActionItem
                icon="swap-horizontal"
                label="Swap"
                onPress={() => navigation.navigate('Swap')}
              />
              <ActionItem
                icon="arrow-up-outline"
                label="Withdraw"
                onPress={() => navigation.navigate('Withdraw', {})}
              />
              <ActionItem
                icon="arrow-down-outline"
                label="Receive"
                onPress={comingSoon}
              />
              <ActionItem
                icon="pie-chart-outline"
                label="Stats"
                onPress={comingSoon}
              />
            </View>

            <Card style={styles.addressCard}>
              <AddressWithCopy address={address ?? ''} label="Your Wallet Address" />
            </Card>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Portfolio</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {effectiveBalances.map((b) => (
              <TouchableOpacity key={b.symbol} activeOpacity={0.7}>
                <Card style={styles.balanceCard} elevated>
                  <View style={styles.balanceRow}>
                    <View style={styles.balanceLeft}>
                      <View style={styles.tokenIcon}>
                        <Text style={styles.tokenSymbolText}>{b.symbol.substring(0, 1)}</Text>
                      </View>
                      <View>
                        <Text style={styles.tokenName}>{b.symbol}</Text>
                        <Text style={styles.tokenNetwork}>Mainnet</Text>
                      </View>
                    </View>
                    <View style={styles.balanceRight}>
                      <Text style={styles.balanceValue}>{b.balanceFormatted}</Text>
                      <Text style={styles.balanceSubValue}>$0.00</Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.md },
  heroSection: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  heroLabel: {
    fontSize: typography.sm,
    color: colors.textTertiary,
    fontFamily: typography.fontFamily,
    marginBottom: spacing.xs,
  },
  heroAmount: {
    fontSize: 42,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBold,
    letterSpacing: -1,
  },
  heroTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: spacing.sm,
  },
  heroTrendText: {
    fontSize: typography.xs,
    color: colors.accent,
    marginLeft: 4,
    fontFamily: typography.fontFamilySemiBold,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  addressCard: {
    marginBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.border
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.lg,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBold,
  },
  seeAll: {
    fontSize: typography.sm,
    color: colors.accent,
    fontFamily: typography.fontFamilySemiBold,
  },
  balanceCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceLeft: { flexDirection: 'row', alignItems: 'center' },
  tokenIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  tokenSymbolText: {
    fontSize: typography.md,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBold,
  },
  tokenName: {
    fontSize: typography.md,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilySemiBold,
  },
  tokenNetwork: {
    fontSize: typography.xs,
    color: colors.textTertiary,
  },
  balanceRight: { alignItems: 'flex-end' },
  balanceValue: {
    fontSize: typography.md,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilySemiBold,
  },
  balanceSubValue: {
    fontSize: typography.xs,
    color: colors.textTertiary,
  },
});
