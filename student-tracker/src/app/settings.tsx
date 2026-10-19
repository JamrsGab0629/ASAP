import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { SectionHeader } from '@/components/SectionHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import type { SegmentOption } from '@/components/SegmentedControl';
import { fonts, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { ThemePreference } from '@/theme';

const APPEARANCE_OPTIONS: SegmentOption<ThemePreference>[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function SettingsScreen() {
  const { colors, preference, setPreference } = useTheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: 48, paddingHorizontal: space.xl, gap: space.lg }}>
      <View style={{ gap: space.sm }}>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Back"
          style={{ width: 44, height: 44, marginLeft: -10, justifyContent: 'center' }}
        >
          <ChevronLeft size={24} color={colors.text} />
        </Pressable>
        <Text style={{ fontFamily: fonts.serif, fontSize: 28, color: colors.text }}>Settings</Text>
      </View>

      <SectionHeader title="Appearance" />
      <SegmentedControl
        options={APPEARANCE_OPTIONS}
        value={preference}
        onChange={setPreference}
        accessibilityLabel="Appearance"
      />
      <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>
        System follows your phone's dark mode setting.
      </Text>
    </View>
  );
}