import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography } from '../theme';
import { Button } from './Button';

interface ErrorWithRetryProps {
  message?: string;
  onRetry: () => void;
  title?: string;
}

export function ErrorWithRetry({
  message = 'Something went wrong. Please try again.',
  onRetry,
  title = 'Error',
}: ErrorWithRetryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name="alert-circle-outline" size={48} color={colors.error} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Button title="Retry" onPress={onRetry} variant="primary" fullWidth style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconWrap: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.xl,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBold,
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    fontFamily: typography.fontFamily,
  },
  button: {
    minWidth: 160,
  },
});
