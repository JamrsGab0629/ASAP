import { Suspense, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ThemedStack } from '@/components/ThemedStack';
import { ThemedStatusBar } from '@/components/ThemedStatusBar';
import { initializeDatabase } from '@/db/initialize';
import { ThemeProvider } from '@/theme';
import { useAppFonts } from '@/theme/useAppFonts';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsReady = useAppFonts();

  useEffect(() => {
    if (fontsReady) SplashScreen.hideAsync();
  }, [fontsReady]);

  if (!fontsReady) return null;

  return (
    <ThemeProvider>
      <ThemedStatusBar />
      <Suspense fallback={<LoadingScreen />}>
        <SQLiteProvider databaseName="asap.db" onInit={initializeDatabase} useSuspense>
          <ThemedStack />
        </SQLiteProvider>
      </Suspense>
    </ThemeProvider>
  );
}