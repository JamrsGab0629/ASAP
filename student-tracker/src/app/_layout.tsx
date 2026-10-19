import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { useFonts, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { initDb } from '@/db/schema';

export default function RootLayout() {
  const [loaded] = useFonts({
    Fraunces_600SemiBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });
  if (!loaded) return null;

  return (
    <SQLiteProvider databaseName="asap.db" onInit={initDb}>
      <Stack screenOptions={{ headerShown: false }} />
    </SQLiteProvider>
  );
}