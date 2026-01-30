import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItem,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { colors, spacing, typography } from '../theme';
import { Skeleton, ErrorWithRetry, HistoryItem } from '../components';
import { useHistory, historyQueryKey } from '../hooks/useHistory';
import type { TransactionRecord } from '../types';
import type { RootStackParamList } from '../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'HistoryDetail'>;

function filterTransactions(list: TransactionRecord[], search: string): TransactionRecord[] {
  const q = search.trim().toLowerCase();
  if (!q) return list;
  return list.filter((t) => {
    const typeStr = t.type === 'swap' ? 'swap' : 'withdrawal';
    const amountStr = `${t.amount} ${t.token}`.toLowerCase();
    const statusStr = t.status.toLowerCase();
    return (
      typeStr.includes(q) ||
      amountStr.includes(q) ||
      statusStr.includes(q)
    );
  });
}

export function HistoryScreen() {
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const { top, bottom } = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const { data: transactions = [], isLoading, isRefetching, isError } = useHistory();

  const filtered = useMemo(() => filterTransactions(transactions, search), [transactions, search]);

  const renderItem: ListRenderItem<TransactionRecord> = ({ item }) => (
    <HistoryItem item={item} onPress={() => navigation.navigate('HistoryDetail', { record: item })} />
  );

  const Header = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>History</Text>
      <View style={styles.searchBar}>
        <Icon name="search" size={18} color={colors.textTertiary} />
        <TextInput
          style={styles.input}
          placeholder="Search transactions..."
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
        {search !== '' && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Icon name="close-circle" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (isError) return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Header />
      <ErrorWithRetry message="Failed to load history" onRetry={() => queryClient.invalidateQueries({ queryKey: historyQueryKey })} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={isLoading ? [] : filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: top + spacing.md, paddingBottom: bottom + spacing.xl }
        ]}
        ListHeaderComponent={<Header />}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => queryClient.invalidateQueries({ queryKey: historyQueryKey })}
            tintColor={colors.accent}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.skeletonContainer}>
              <Skeleton width="100%" height={90} style={styles.skeleton} />
              <Skeleton width="100%" height={90} style={styles.skeleton} />
              <Skeleton width="100%" height={90} style={styles.skeleton} />
            </View>
          ) : (
            <Text style={styles.emptyText}>{search ? 'No results found' : 'No transactions yet'}</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { paddingHorizontal: spacing.md },
  headerContainer: { marginBottom: spacing.lg },
  title: {
    fontSize: typography.xxl,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    marginLeft: spacing.xs,
    fontSize: typography.md,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
  },
  skeletonContainer: { marginTop: spacing.md },
  skeleton: { marginBottom: spacing.sm, borderRadius: 16 },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.textTertiary,
    fontFamily: typography.fontFamily,
  },
});
