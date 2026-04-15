// ─── Typography System ───────────────────────────────────────────
import { StyleSheet, TextStyle } from 'react-native';

const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

// Tailwind mapped typography scale
export const Typography = StyleSheet.create({
  // H1: text-2xl font-semibold tracking-tight
  display: {
    fontFamily: fontFamily.semibold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  // H2/Title: text-lg font-medium
  heading: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: -0.25,
  },
  // Subheaders/Section Titles: text-sm font-medium uppercase tracking-wider
  title: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // text-base
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  // text-sm
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  // text-sm font-medium
  bodyMedium: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  // text-xs
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  captionMedium: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  // text-[10px] uppercase tracking-wide
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 10,
    lineHeight: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
