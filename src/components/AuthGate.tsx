import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Vibration, Animated } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../hooks';
import { colors, spacing, typography } from '../theme';
import {
  setUnlocked,
  setPasscodeSet,
  incrementFailedAttempts,
  resetFailedAttempts,
} from '../store/authSlice';
import {
  isPasscodeSet as checkIsPasscodeSet,
  savePasscode,
  verifyPasscode,
} from '../utils/secureStorage';
import { PasscodeDots } from './PasscodeDots';
import { Keypad } from './Keypad';

const PASSCODE_LENGTH = 6;
const MAX_FAILED_ATTEMPTS = 5;

export function AuthGate() {
  const dispatch = useDispatch();
  const { failedAttempts } = useAppSelector(s => s.auth);

  const [inputPasscode, setInputPasscode] = useState<string>('');
  const [isSettingPasscode, setIsSettingPasscode] = useState<boolean>(false);
  const [confirmPasscode, setConfirmPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkPasscodeStatus = async () => {
      const isSet = await checkIsPasscodeSet();
      dispatch(setPasscodeSet(isSet));
      if (!isSet) {
        setIsSettingPasscode(true);
      }
    };
    checkPasscodeStatus();
  }, [dispatch]);

  useEffect(() => {
    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
      setPasscodeError(
        `Too many failed attempts. App is temporarily locked. Try again later.`,
      );
    }
  }, [failedAttempts]);

  const handlePasscodeInput = async (key: string) => {
    if (passcodeError) setPasscodeError(null);

    let newPasscode = inputPasscode;
    if (key === 'delete') {
      newPasscode = newPasscode.slice(0, -1);
    } else if (newPasscode.length < PASSCODE_LENGTH) {
      newPasscode += key;
    }
    setInputPasscode(newPasscode);

    if (newPasscode.length === PASSCODE_LENGTH) {
      if (isSettingPasscode) {
        if (!confirmPasscode) {
          setConfirmPasscode(newPasscode);
          setInputPasscode('');
        } else if (newPasscode === confirmPasscode) {
          const success = await savePasscode(newPasscode);
          if (success) {
            dispatch(setPasscodeSet(true));
            dispatch(setUnlocked(true));
            setIsSettingPasscode(false);
          } else {
            setPasscodeError('Failed to set passcode. Please try again.');
            setInputPasscode('');
            setConfirmPasscode('');
          }
        } else {
          setPasscodeError('Passcodes do not match. Try again.');
          setInputPasscode('');
          setConfirmPasscode('');
          triggerShake();
          Vibration.vibrate(100);
        }
      } else {
        const isValid = await verifyPasscode(newPasscode);
        if (isValid) {
          dispatch(setUnlocked(true));
          dispatch(resetFailedAttempts());
        } else {
          setPasscodeError('Incorrect passcode.');
          dispatch(incrementFailedAttempts());
          setInputPasscode('');
          triggerShake();
          Vibration.vibrate(100);
        }
      }
    }
  };

  const triggerShake = () => {
    shakeAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const titleText = isSettingPasscode
    ? confirmPasscode
      ? 'Confirm your new passcode'
      : 'Create a new passcode'
    : 'Enter your passcode';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{titleText}</Text>

      <Animated.View style={[{ transform: [{ translateX: shakeAnimation }] }]}>
        <PasscodeDots passcode={inputPasscode} length={PASSCODE_LENGTH} />
      </Animated.View>

      {passcodeError && <Text style={styles.errorText}>{passcodeError}</Text>}

      <Keypad
        onKeyPress={handlePasscodeInput}
        disabled={inputPasscode.length === PASSCODE_LENGTH && !isSettingPasscode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.xxl,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  errorText: {
    color: colors.error,
    fontFamily: typography.fontFamily,
    fontSize: typography.md,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
});
