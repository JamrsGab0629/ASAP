import { Text, View } from 'react-native';
import { fonts, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { GradeView, PeriodSummary } from '../gradeView';
import type { GradeScale } from '../types';
import { NeededScoreCard } from './NeededScoreCard';
import { PeriodSummaryRow } from './PeriodSummaryRow';
import { StandingCard } from './StandingCard';

type Props = {
  view: GradeView;
  scale: GradeScale;
  summaries: PeriodSummary[];
  onSelectTarget: (equivalent: string) => void;
  onOpenPeriod: (periodId: number) => void;
};

/** The subject's final grade, built from the period grades. */
export function OverallPanel({ view, scale, summaries, onSelectTarget, onOpenPeriod }: Props) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: space.lg }}>
      <StandingCard view={view} scale={scale} title="Final grade so far" />
      <NeededScoreCard view={view} onSelectTarget={onSelectTarget} />
      {Math.abs(view.totalWeight - 100) > 0.001 && (
        <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.warning }}>
          Your periods add up to {view.totalWeight}%, not 100%. Open a period and tap Edit to fix its weight.
        </Text>
      )}
      <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 }}>
        By period
      </Text>
      {summaries.map((s) => (
        <PeriodSummaryRow key={s.period.id} summary={s} onPress={() => onOpenPeriod(s.period.id)} />
      ))}
    </View>
  );
}