import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import { colors, spacing, typography } from '../theme';

interface DetailRowProps {
  label: string;
  value: string;
  copyable?: boolean;
}

export function DetailRow({ label, value, copyable }: DetailRowProps) {
  const handleCopy = () => {
    Clipboard.setString(value);
    Toast.show({ type: 'success', text1: 'Copied' });
  };

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value} numberOfLines={2}>{value}</Text>
        {copyable && (
          <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
            <Icon name="copy-outline" size={18} color={colors.accent} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: spacing.md },
  label: { fontSize: typography.xs, color: colors.textTertiary, marginBottom: spacing.xs, fontFamily: typography.fontFamily },
  value: { fontSize: typography.md, color: colors.textPrimary, fontFamily: typography.fontFamilySemiBold, flex: 1 },
  valueRow: { flexDirection: 'row', alignItems: 'center' },
  copyBtn: { marginLeft: spacing.sm, padding: spacing.xs },
});
