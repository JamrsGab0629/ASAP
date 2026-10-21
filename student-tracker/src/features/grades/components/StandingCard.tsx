import { Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { GradeView } from '../gradeView';
import type { GradeScale } from '../types';

type Props = { view: GradeView; scale: GradeScale };

export function StandingCard({ view, scale }: Props) {
  const { colors } = useTheme();
  const { standing, entry, passing } = view;

  const summary = entry
    ? `equals ${entry.equivalent} on your scale${scale.passingGrade !== null ? ` · passing is ${scale.passingGrade.toFixed(2)}` : ''}`
    : 'Add a scored assessment to see your standing';

  return (
    <View style={{ backgroundColor: colors.hero, borderRadius: radius.lg, padding: space.xl, gap: space.sm }}>
      <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.onHeroMuted }}>Current standing</Text>
      <Text style={{ fontFamily: fonts.serif, fontSize: 44, color: colors.onHero }}>
        {standing.percent === null ? '—' : `${standing.percent.toFixed(1)}%`}
      </Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.onHeroMuted }}>{summary}</Text>
      {passing === false && (
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.onHero }}>Below passing</Text>
      )}

      <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.onHeroMuted + '44', marginTop: space.md }}>
        <View
          style={{
            height: 6, borderRadius: 3, backgroundColor: colors.onHero,
            width: `${Math.min(100, standing.gradedWeight)}%`,
          }}
        />
      </View>
      <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.onHeroMuted }}>
        {Math.round(standing.gradedWeight)}% of the grade is scored · {Math.round(standing.remainingWeight)}% left
      </Text>
    </View>
  );
}