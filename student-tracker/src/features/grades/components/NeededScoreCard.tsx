import { Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { GradeView } from '../gradeView';
import { TargetChips } from './TargetChips';

type Props = { view: GradeView; onSelectTarget: (equivalent: string) => void };

export function NeededScoreCard({ view, onSelectTarget }: Props) {
  const { colors } = useTheme();
  const { needed, targetEntry, targetOptions, pendingLabel } = view;
  if (!needed || !targetEntry) return null;

  const target = `${targetEntry.equivalent} (${targetEntry.minScore}%+)`;
  const headline =
    needed.kind === 'needed' ? `${needed.percent}%` : needed.kind === 'secured' ? 'Secured' : 'Out of reach';
  const detail =
    needed.kind === 'needed'
      ? `on the ${pendingLabel}, to reach ${target}`
      : needed.kind === 'secured'
        ? `You've locked in ${target} whatever happens next.`
        : `Even a perfect score on the ${pendingLabel} can't reach ${target}.`;

  return (
    <View
      style={{
        backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1,
        borderColor: colors.border, padding: space.lg, gap: space.sm,
      }}
    >
      <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted }}>Score needed</Text>
      <Text style={{ fontFamily: fonts.serif, fontSize: 32, color: needed.kind === 'unreachable' ? colors.danger : colors.text }}>
        {headline}
      </Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted }}>{detail}</Text>
      <View style={{ marginTop: space.sm }}>
        <TargetChips options={targetOptions} selected={targetEntry.equivalent} onSelect={onSelectTarget} />
      </View>
    </View>
  );
}