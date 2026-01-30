import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography } from '../theme';

interface KeypadButtonProps {
  value: string;
  onPress: (value: string) => void;
  disabled?: boolean;
  isDelete?: boolean;
}

export function KeypadButton({ value, onPress, disabled, isDelete }: KeypadButtonProps) {
  if (value === 'empty') {
    return <View style={styles.button} />;
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => onPress(value)}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {isDelete ? (
        <Icon name="backspace-outline" size={28} color={colors.textPrimary} />
      ) : (
        <Text style={styles.buttonText}>{value}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: spacing.sm,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    fontSize: typography.xl,
    fontFamily: typography.fontFamilySemiBold,
    color: colors.textPrimary,
  },
});
