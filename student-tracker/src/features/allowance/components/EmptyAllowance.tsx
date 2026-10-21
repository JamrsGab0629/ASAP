import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';

export function EmptyAllowance({ onSetUp }: { onSetUp: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: space.md }}>
      <Text style={{ fontFamily: fonts.serif, fontSize: 20, color: colors.text }}>How much is your allowance?</Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted }}>
        Tell ASAP how often you get it, daily, weekly or monthly, and how much. It repeats every period, and ASAP tracks how fast you're spending it.
      </Text>
      <Pressable onPress={onSetUp} style={{ padding: space.lg, borderRadius: radius.lg, backgroundColor: colors.primary, alignItems: 'center' }}>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.onPrimary }}>Set my allowance</Text>
      </Pressable>
    </View>
  );
}