// ─── Design Tokens ───────────────────────────────────────────────
export const Palette = {
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Pastel Blue Core
  blue: {
    50: '#F0F4FF',
    100: '#E0ECFF',
    200: '#C7DBFF',
    300: '#A3C4FE',
    400: '#7BA8F7',
    500: '#5B8DEF',
    600: '#4A75D4',
    700: '#3A5EB8',
    800: '#2A4690',
    900: '#1B2F68',
  },

  // Lavender Accent
  lavender: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
  },

  // Mint Accent
  mint: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
  },

  // Warm Peach
  peach: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
  },

  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  red: {
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  base: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
};

export const BorderRadius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  full: 9999,
};

// Application Color System — Pastel Blue Theme
export const Colors = {
  light: {
    background: Palette.blue[50],       // soft ice-blue background
    surface: Palette.white,
    surfaceMuted: Palette.blue[100],     // tinted card interiors
    surfaceSecondary: Palette.blue[200], // progress bar track, disabled bg

    // Primary accent — pastel blue
    accent: Palette.blue[500],
    accentLight: Palette.blue[100],
    accentDark: Palette.blue[700],

    // Secondary accents
    secondary: Palette.lavender[400],
    secondaryLight: Palette.lavender[50],
    tertiary: Palette.mint[400],
    tertiaryLight: Palette.mint[50],

    text: Palette.gray[900],            // headings, main body
    textSecondary: Palette.gray[500],   // subtitles, secondary
    textTertiary: Palette.gray[400],    // meta, faint labels

    border: Palette.blue[200],          // main borders — blue-tinted
    borderLight: Palette.blue[100],     // dividers
    borderDark: Palette.blue[300],      // focus/hover borders
    borderDashed: Palette.blue[300],

    // Semantic
    error: Palette.red[500],
    success: Palette.mint[500],
    warning: Palette.peach[500],

    // UI specific
    tabBar: Palette.white,
    tabBarInactive: Palette.gray[400],
    shadow: 'rgba(91, 141, 239, 0.08)',

    // Badge colors
    badgeBeginner: Palette.mint[100],
    badgeBeginnerText: Palette.mint[500],
    badgeIntermediate: Palette.peach[100],
    badgeIntermediateText: Palette.peach[500],
    badgeAdvanced: Palette.lavender[100],
    badgeAdvancedText: Palette.lavender[500],
  },
  dark: {
    // Deep blue dark mode
    background: '#0D1117',
    surface: '#161B22',
    surfaceMuted: '#1C2333',
    surfaceSecondary: '#243044',

    accent: Palette.blue[400],
    accentLight: '#1C2D4A',
    accentDark: Palette.blue[300],

    secondary: Palette.lavender[400],
    secondaryLight: '#2D2545',
    tertiary: Palette.mint[400],
    tertiaryLight: '#1A3332',

    text: '#E6EDF3',
    textSecondary: '#8B949E',
    textTertiary: '#6E7681',

    border: '#30363D',
    borderLight: '#21262D',
    borderDark: '#484F58',
    borderDashed: '#484F58',

    error: Palette.red[400],
    success: Palette.mint[400],
    warning: Palette.peach[400],

    tabBar: '#0D1117',
    tabBarInactive: '#6E7681',
    shadow: 'rgba(0, 0, 0, 0.3)',

    badgeBeginner: '#1A3332',
    badgeBeginnerText: Palette.mint[400],
    badgeIntermediate: '#332A1A',
    badgeIntermediateText: Palette.peach[400],
    badgeAdvanced: '#2D2545',
    badgeAdvancedText: Palette.lavender[400],
  },
};

// Export a type for the color scheme
export type ColorScheme = typeof Colors.light;
