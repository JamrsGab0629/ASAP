import { useFonts, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';

/** True when fonts are ready, or failed to load (the app still opens with system fonts). */
export function useAppFonts(): boolean {
  const [loaded, error] = useFonts({
    Fraunces_600SemiBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });
  return loaded || error !== null;
}