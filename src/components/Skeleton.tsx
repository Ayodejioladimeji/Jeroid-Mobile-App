import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, ViewStyle, DimensionValue } from 'react-native';
import { colors, spacing } from '../theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: ViewStyle;
  borderRadius?: number;
}

export function Skeleton({
  width = '100%',
  height = 24,
  style,
  borderRadius = 8,
}: SkeletonProps) {
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.6, useNativeDriver: true, duration: 600 }),
        Animated.timing(opacity, { toValue: 0.3, useNativeDriver: true, duration: 600 }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  const baseStyle: ViewStyle = {
    backgroundColor: colors.backgroundTertiary,
    height,
    borderRadius,
  };

  const animatedStyle = { opacity };

  if (typeof width === 'string') {
    return (
      <View style={[baseStyle, style, { width: width as DimensionValue }]}>
        <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} />
      </View>
    );
  } else {
    return (
      <Animated.View style={[baseStyle, style, animatedStyle, { width: width as number }]} />
    );
  }
}

export function DashboardSkeleton() {
  return (
    <View style={skeletonStyles.container}>
      {/* Hero Section Skeleton */}
      <View style={skeletonStyles.heroSection}>
        <Skeleton width={80} height={14} style={{ marginBottom: spacing.sm }} />
        <Skeleton width={200} height={42} style={{ marginBottom: spacing.sm }} />
        <Skeleton width={110} height={24} borderRadius={12} />
      </View>

      {/* Action Grid Skeleton */}
      <View style={skeletonStyles.actionGrid}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={skeletonStyles.actionItem}>
            <Skeleton width={50} height={50} borderRadius={16} style={{ marginBottom: 8 }} />
            <Skeleton width={40} height={12} />
          </View>
        ))}
      </View>

      {/* Address Card Skeleton */}
      <View style={skeletonStyles.addressCard}>
        <Skeleton width={100} height={12} style={{ marginBottom: spacing.xs }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton width="80%" height={16} />
          <Skeleton width={20} height={20} borderRadius={4} />
        </View>
      </View>

      {/* Portfolio Header Skeleton */}
      <View style={skeletonStyles.sectionHeader}>
        <Skeleton width={120} height={22} />
        <Skeleton width={50} height={14} />
      </View>

      {/* Balance Cards Skeleton */}
      {[1, 2, 3].map((i) => (
        <View key={i} style={skeletonStyles.balanceCard}>
          <View style={skeletonStyles.balanceRow}>
            <View style={skeletonStyles.balanceLeft}>
              <Skeleton width={44} height={44} borderRadius={22} style={{ marginRight: spacing.md }} />
              <View>
                <Skeleton width={60} height={16} style={{ marginBottom: 4 }} />
                <Skeleton width={40} height={12} />
              </View>
            </View>
            <View style={skeletonStyles.balanceRight}>
              <Skeleton width={80} height={16} style={{ marginBottom: 4 }} />
              <Skeleton width={40} height={12} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  container: { flex: 1 },
  heroSection: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
  },
  addressCard: {
    marginBottom: spacing.xl,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  balanceCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceLeft: { flexDirection: 'row', alignItems: 'center' },
  balanceRight: { alignItems: 'flex-end' },
});