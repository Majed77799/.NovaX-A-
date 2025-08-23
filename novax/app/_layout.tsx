import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from '@/src/providers/AppProviders';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(dashboard)/home" />
          <Stack.Screen name="(marketing)/index" />
          <Stack.Screen name="(research)/index" />
          <Stack.Screen name="(generator)/index" />
          <Stack.Screen name="(marketing)/copilot" />
          <Stack.Screen name="(funnel)/freebie" />
          <Stack.Screen name="(payments)/checkout" />
          <Stack.Screen name="(social)/index" />
          <Stack.Screen name="(gamification)/index" />
          <Stack.Screen name="(settings)/index" />
          <Stack.Screen name="(legal)/terms" />
          <Stack.Screen name="(onboarding)/index" />
          <Stack.Screen name="(products)/index" />
          <Stack.Screen name="(marketplace)/index" />
          <Stack.Screen name="(webviews)/web" />
        </Stack>
      </AppProviders>
    </SafeAreaProvider>
  );
}