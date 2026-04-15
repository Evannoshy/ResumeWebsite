// ─── Input Component ─────────────────────────────────────────────
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextInputProps, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Spacing } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, hint, containerStyle, style, ...props }: InputProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[Typography.bodyMedium, { color: colors.text, marginBottom: 8 }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            borderBottomColor: error ? colors.error : focused ? colors.accent : colors.border,
            borderBottomWidth: focused ? 1.5 : 1,
          },
          style,
        ]}
        placeholderTextColor={colors.textTertiary}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
      {error && (
        <Text style={[Typography.caption, { color: colors.error, marginTop: 4 }]}>
          {error}
        </Text>
      )}
      {hint && !error && (
        <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
          {hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  input: {
    fontSize: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    paddingHorizontal: 0,
  },
});
