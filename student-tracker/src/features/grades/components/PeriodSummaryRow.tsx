import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { PeriodSummary } from '../gradeView';

type Props = { summary: PeriodSummary; onPress: () => void };

export function PeriodSummaryRow({ summary, onPress }: Props) {
  const { colors } = useTheme();
  const { period, percent, equivalent } = summary;
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: space.lg,
        backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
      }}
    >
      <View>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.text }}>{period.name}</Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>
          {period.weight}% of the final grade
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontFamily: fonts.serif, fontSize: 22, color: percent === null ? colors.textMuted : colors.text }}>
          {percent === null ? '—' : `${percent.toFixed(1)}%`}
        </Text>
        {equivalent && <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.primary }}>{equivalent}</Text>}
      </View>
    </Pressable>
  );
}