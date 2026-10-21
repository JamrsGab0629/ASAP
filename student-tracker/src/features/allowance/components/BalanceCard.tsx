import { Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { formatPeso } from '@/lib/format';
import { useTheme } from '@/theme';
import type { BudgetStatus } from '../budgetStatus';
import { THIS_PERIOD } from '../period';
import type { PeriodSummary } from '../summary';
import { SpendBar } from './SpendBar';

export function BalanceCard({ summary }: { summary: PeriodSummary }) {
  const { colors } = useTheme();
  const { total, spent, left, assessment, isCurrent, type } = summary;

  const statusColor: Record<BudgetStatus, string> = {
    comfortable: colors.success, watch: colors.warning, tight: colors.warning, danger: colors.danger,
  };
  const barColor = assessment ? statusColor[assessment.status] : colors.primary;
  const hasBudget = total > 0;
  const percent = hasBudget ? Math.round((spent / total) * 100) : 0;

  const caption = left < 0 ? 'Over the allowance by' : isCurrent ? `Left ${THIS_PERIOD[type]}` : 'Left at the end';

  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: space.xl, gap: space.sm }}>
      <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted }}>
        {hasBudget ? caption : 'No allowance was set for this period'}
      </Text>
      <Text style={{ fontFamily: fonts.serif, fontSize: 44, color: left < 0 ? colors.danger : colors.text }}>
        {hasBudget ? formatPeso(Math.abs(left)) : formatPeso(spent)}
      </Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted }}>
        {hasBudget ? `${formatPeso(spent)} spent of ${formatPeso(total)} · ${percent}%` : 'spent'}
      </Text>

      {hasBudget && (
        <View style={{ marginTop: space.sm }}>
          <SpendBar fraction={spent / total} color={barColor} trackColor={colors.border} markerColor={colors.textMuted} />
          <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted, marginTop: 4, alignSelf: 'flex-end', marginRight: '15%' }}>
            80%
          </Text>
        </View>
      )}

      {assessment && (
        <View style={{ marginTop: space.sm, gap: 4 }}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: barColor }}>{assessment.label}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.text }}>{assessment.message}</Text>
          {assessment.reasons.map((reason) => (
            <Text key={reason} style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted }}>{reason}</Text>
          ))}
        </View>
      )}
    </View>
  );
}