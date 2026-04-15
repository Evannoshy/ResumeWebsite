// ─── Empty State Component ───────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Spacing, BorderRadius } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Button } from './Button';

interface EmptyStateProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: colors.accentLight, borderColor: colors.border }]}>
        <Feather name={icon} size={28} color={colors.accent} />
      </View>
      <Text style={[Typography.heading, { color: colors.text, textAlign: 'center', marginTop: Spacing.xl }]}>
        {title}
      </Text>
      <Text
        style={[
          Typography.body,
          {
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: Spacing.sm,
            paddingHorizontal: Spacing.xl,
          },
        ]}
      >
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          style={{ marginTop: Spacing['2xl'] }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

// ─── Section Header Component ────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={sectionStyles.container}>
      <Text style={[Typography.title, { color: colors.text, fontSize: 13 }]}>{title}</Text>
      {action && onAction && (
        <Text
          onPress={onAction}
          style={[Typography.bodyMedium, { color: colors.accent, fontSize: 12 }]}
        >
          {action}
        </Text>
      )}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
});
