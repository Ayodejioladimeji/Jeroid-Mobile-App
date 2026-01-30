import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import { colors, spacing, typography } from '../theme';

function truncateAddress(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
}

interface AddressWithCopyProps {
  address: string;
  label?: string;
  style?: object;
  textStyle?: object;
}

export function AddressWithCopy({ address, label, style, textStyle }: AddressWithCopyProps) {
  const copy = () => {
    Clipboard.setString(address);
    Toast.show({ type: 'success', text1: 'Address copied' });
  };

  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity onPress={copy} style={styles.row} activeOpacity={0.8}>
        <Text style={[styles.address, textStyle]} numberOfLines={1}>
          {truncateAddress(address)}
        </Text>
        <Icon name="copy-outline" size={20} color={colors.accent} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  label: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  address: {
    fontSize: typography.md,
    color: colors.accent,
    fontFamily: typography.fontFamily,
    marginRight: spacing.xs,
  },
  icon: {
    marginLeft: spacing.xs,
  },
});
