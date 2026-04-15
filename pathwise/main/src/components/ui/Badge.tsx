// ─── Badge Component ─────────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { BorderRadius, Spacing } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'accent';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', size = 'sm', style }: BadgeProps) {
  const { colors } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'success': return { bg: colors.badgeBeginner, text: colors.badgeBeginnerText };
      case 'warning': return { bg: colors.badgeIntermediate, text: colors.badgeIntermediateText };
      case 'error': return { bg: colors.badgeAdvanced, text: colors.badgeAdvancedText };
      case 'accent': return { bg: colors.accentLight, text: colors.accent };
      default: return { bg: colors.surfaceMuted, text: colors.textSecondary };
    }
  };

  const badgeColors = getColors();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: badgeColors.bg },
        style,
      ]}
    >
      <Text style={[Typography.label, { color: badgeColors.text }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
});

// ─── Chip Component ──────────────────────────────────────────────

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Chip({ label, selected = false, onPress, style }: ChipProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        chipStyles.chip,
        {
          backgroundColor: selected ? colors.accent : colors.surface,
          borderColor: selected ? colors.accent : colors.border,
        },
        style,
      ]}
    >
      <Text
        style={[
          Typography.captionMedium,
          { color: selected ? '#FFFFFF' : colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    marginRight: 8,
    marginBottom: 8,
  },
});
