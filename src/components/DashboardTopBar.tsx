import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography } from '../theme';

const USER_NAME = 'Ayodeji Oladimeji';

export function DashboardTopBar() {
  return (
    <View style={styles.bar}>
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {USER_NAME.split(' ').map((n) => n[0]).join('')}
          </Text>
        </View>
        <View>
          <Text style={styles.name}>{USER_NAME}</Text>
          <Text style={styles.greeting}>GM,</Text>
        </View>
      </View>
      <View style={styles.rightActions}>
        <TouchableOpacity style={styles.iconBtn}>
          <Icon name="search-outline" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <View style={styles.notifDot} />
          <Icon name="notifications-outline" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  rightActions: { flexDirection: 'row', gap: spacing.sm },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.sm,
    color: colors.white,
    fontFamily: typography.fontFamilySemiBold,
  },
  greeting: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
  },
  name: {
    fontSize: typography.sm,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilySemiBold,
    marginLeft: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    zIndex: 1,
    borderWidth: 1.5,
    borderColor: colors.surface,
  }
});
