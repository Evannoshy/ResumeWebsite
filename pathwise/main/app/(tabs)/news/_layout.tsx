// ─── News Stack Layout ───────────────────────────────────────────
import { Stack } from 'expo-router';
import { useTheme } from '../../../src/context/ThemeContext';

export default function NewsLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
