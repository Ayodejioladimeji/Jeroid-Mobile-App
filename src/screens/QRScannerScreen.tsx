import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { Camera, useCameraDevice, useCodeScanner, useCameraPermission, CameraPermissionStatus } from 'react-native-vision-camera';
import { colors, spacing, typography } from '../theme';
import { Card, Button, Input } from '../components';
import type { RootStackParamList } from '../types/navigation';
import { isValidAddress } from '../utils/validation';

type Route = RouteProp<RootStackParamList, 'QRScanner'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'QRScanner'>;

export function QRScannerScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { top, bottom } = useSafeAreaInsets();
  const returnScreen = route.params?.returnScreen ?? 'Withdraw';
  const [manualAddress, setManualAddress] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [cameraStatus, setCameraStatus] = useState<CameraPermissionStatus>('not-determined');

  useEffect(() => {
    const getStatus = async () => {
      const currentStatus = await Camera.getCameraPermissionStatus();
      setCameraStatus(currentStatus);
    };
    getStatus();
  }, []);

  const handleScannedAddress = useCallback((address: string) => {
    if (!isScanning) return; 
    setIsScanning(false);

    if (!isValidAddress(address)) {
      Alert.alert('Invalid address', 'Scanned value is not a valid Ethereum address (0x + 40 hex chars).', [
        { text: 'OK', onPress: () => setIsScanning(true) },
      ]);
      return;
    }
    navigation.navigate(returnScreen, { scannedAddress: address });
  }, [navigation, returnScreen, isScanning]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      const firstCode = codes[0];
      if (firstCode?.value) {
        handleScannedAddress(firstCode.value);
      }
    },
  });

  const handleManualSubmit = () => {
    if (!manualAddress.trim()) return;
    handleScannedAddress(manualAddress.trim());
  };

  if (device == null) {
    return (
      <View style={[styles.container, { paddingBottom: bottom + spacing.md, paddingTop: top + spacing.md }]}>
        <Text style={styles.errorText}>No camera device found. Please ensure your device has a camera.</Text>
        <Card style={styles.manualInputCard}>
          <Text style={styles.label}>Or paste / enter address manually</Text>
          <Input
            placeholder="0x..."
            value={manualAddress}
            onChangeText={setManualAddress}
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.inputContainer}
          />
          <Button
            title="Use this address"
            onPress={handleManualSubmit}
            disabled={!manualAddress.trim() || !isValidAddress(manualAddress)}
            disabledReason={manualAddress.trim() && !isValidAddress(manualAddress) ? 'Invalid address (0x + 40 hex)' : undefined}
            fullWidth
            style={styles.button}
          />
        </Card>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={[styles.container, { paddingBottom: bottom + spacing.md, paddingTop: top + spacing.md }]}>
        <Text style={styles.permissionText}>Permission to access camera is required for QR scanning.</Text>
        {cameraStatus === 'denied' ? (
          <Button
            title="Open Settings"
            onPress={() => Linking.openSettings()}
            variant="primary"
            fullWidth
            style={styles.button}
          />
        ) : (
          <Button
            title="Request Camera Permission"
            onPress={() => requestPermission()}
            variant="primary"
            fullWidth
            style={styles.button}
          />
        )}
        <Card style={styles.manualInputCard}>
          <Text style={styles.label}>Or paste / enter address manually</Text>
          <Input
            placeholder="0x..."
            value={manualAddress}
            onChangeText={setManualAddress}
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.inputContainer}
          />
          <Button
            title="Use this address"
            onPress={handleManualSubmit}
            disabled={!manualAddress.trim() || !isValidAddress(manualAddress)}
            disabledReason={manualAddress.trim() && !isValidAddress(manualAddress) ? 'Invalid address (0x + 40 hex)' : undefined}
            fullWidth
            style={styles.button}
          />
        </Card>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: bottom + spacing.md, paddingTop: top + spacing.md }]}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isScanning}
        codeScanner={codeScanner}
      />

      <View style={styles.overlay}>
        <View style={styles.scanArea} />
        <Text style={styles.scanText}>Scan QR Code</Text>
      </View>

      <View style={styles.manualInputWrapper}>
        <Card style={styles.manualInputCard}>
          <Text style={styles.label}>Or paste / enter address manually</Text>
          <Input
            placeholder="0x..."
            value={manualAddress}
            onChangeText={setManualAddress}
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.inputContainer}
          />
          <Button
            title="Use this address"
            onPress={handleManualSubmit}
            disabled={!manualAddress.trim() || !isValidAddress(manualAddress)}
            disabledReason={manualAddress.trim() && !isValidAddress(manualAddress) ? 'Invalid address (0x + 40 hex)' : undefined}
            fullWidth
            style={styles.button}
          />
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanArea: {
    width: 200,
    height: 200,
    borderColor: colors.accent,
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: 'transparent',
    marginBottom: spacing.lg,
  },
  scanText: {
    fontSize: typography.lg,
    color: colors.white,
    fontFamily: typography.fontFamilyBold,
    marginBottom: spacing.xxl,
  },
  errorText: {
    fontSize: typography.md,
    color: colors.error,
    textAlign: 'center',
    margin: spacing.xl,
    fontFamily: typography.fontFamily,
  },
  permissionText: {
    fontSize: typography.md,
    color: colors.textPrimary,
    textAlign: 'center',
    margin: spacing.xl,
    fontFamily: typography.fontFamily,
  },
  manualInputWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    backgroundColor: 'transparent',
  },
  manualInputCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontFamily: typography.fontFamily,
  },
  inputContainer: { marginBottom: spacing.sm },
  button: { marginTop: spacing.sm },
});
