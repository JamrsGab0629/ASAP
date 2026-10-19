import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { useTheme } from '@/theme';

export function SettingsButton() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={{ alignItems: 'flex-end' }}>
      <Pressable
        onPress={() => router.push('/settings')}
        accessibilityRole="button"
        accessibilityLabel="Settings"
        style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -10 }}
      >
        <Settings size={22} color={colors.text} strokeWidth={1.8} />
      </Pressable>
    </View>
  );
}