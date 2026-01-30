import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../theme';
import { KeypadButton } from './KeypadButton';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  disabled?: boolean;
}

export function Keypad({ onKeyPress, disabled }: KeypadProps) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'empty', '0', 'delete'];

  return (
    <View style={styles.container}>
      {keys.map((key, index) => (
        <KeypadButton
          key={index}
          value={key}
          onPress={onKeyPress}
          disabled={disabled && key !== 'delete'}
          isDelete={key === 'delete'}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
});
