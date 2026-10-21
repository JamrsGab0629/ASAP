import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { fonts, space } from '@/constants/theme';
import { useTheme } from '@/theme';

type Props = { label: string; isCurrent: boolean; onPrev: () => void; onNext: () => void };

export function PeriodNav({ label, isCurrent, onPrev, onNext }: Props) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Pressable hitSlop={10} onPress={onPrev} accessibilityLabel="Previous period">
        <ChevronLeft size={22} color={colors.textMuted} />
      </Pressable>
      <View style={{ alignItems: 'center', gap: space.xs }}>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.text }}>{label}</Text>
        {isCurrent && <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: colors.primary }}>CURRENT</Text>}
      </View>
      <Pressable hitSlop={10} onPress={onNext} disabled={isCurrent} accessibilityLabel="Next period" style={{ opacity: isCurrent ? 0.25 : 1 }}>
        <ChevronRight size={22} color={colors.textMuted} />
      </Pressable>
    </View>
  );
}