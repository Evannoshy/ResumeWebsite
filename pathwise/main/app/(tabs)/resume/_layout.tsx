// ─── Resume Stack Layout ─────────────────────────────────────────
import { Stack } from 'expo-router';
import { useTheme } from '../../../src/context/ThemeContext';

export default function ResumeLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="editor" options={{ presentation: 'modal' }} />
      <Stack.Screen name="preview" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
