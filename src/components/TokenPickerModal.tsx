import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { colors, spacing, typography } from '../theme';
import type { TokenSymbol } from '../types';

const TOKENS: TokenSymbol[] = ['ETH', 'USDT', 'DAI'];

interface TokenPickerModalProps {
  visible: boolean;
  selected: TokenSymbol;
  onSelect: (symbol: TokenSymbol) => void;
  onClose: () => void;
}

export function TokenPickerModal({
  visible,
  selected,
  onSelect,
  onClose,
}: TokenPickerModalProps) {
  const renderItem: ListRenderItem<TokenSymbol> = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
      activeOpacity={0.8}
    >
      <Text style={styles.symbol}>{item}</Text>
      {item === selected && <Text style={styles.check}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <Text style={styles.title}>Select token</Text>
          <FlatList
            data={TOKENS}
            renderItem={renderItem}
            keyExtractor={(s) => s}
            style={styles.list}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  content: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    maxHeight: '50%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.lg,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilySemiBold,
    marginBottom: spacing.md,
  },
  list: { maxHeight: 300 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
  },
  symbol: {
    fontSize: typography.lg,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilySemiBold,
  },
  check: {
    fontSize: typography.lg,
    color: colors.success,
  },
});
