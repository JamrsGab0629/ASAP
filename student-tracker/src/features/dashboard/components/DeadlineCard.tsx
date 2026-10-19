import { Text, View } from 'react-native';
import { fonts, radius } from '@/constants/theme';
import type { DueDeadline, Priority } from '@/features/deadlines/upcomingDeadlines';
import { formatShortDate, formatTimeOfDate } from '@/lib/dates';
import { useTheme } from '@/theme';
import type { Palette } from '@/theme';

function priorityStyle(priority: Priority, colors: Palette): { label: string; color: string } {
  const styles: Record<Priority, { label: string; color: string }> = {
    high: { label: 'High', color: colors.danger },
    medium: { label: 'Medium', color: colors.warning },
    low: { label: 'Low', color: colors.textMuted },
  };
  return styles[priority] ?? styles.low;
}

type Props = { deadline: DueDeadline };

export function DeadlineCard({ deadline }: Props) {
  const { colors } = useTheme();
  const priority = priorityStyle(deadline.priority, colors);

  return (
    <View
      style={{
        width: 250,
        gap: 8,
        padding: 14,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: deadline.subjectColor }} />
        <Text numberOfLines={1} style={{ flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted }}>
          {deadline.subjectName}
        </Text>
      </View>

      <Text numberOfLines={2} style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.text }}>
        {deadline.title}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: deadline.isOverdue ? colors.danger : colors.textMuted }}>
          {deadline.isOverdue ? 'Overdue · ' : ''}
          {formatShortDate(deadline.dueAt)} · {formatTimeOfDate(deadline.dueAt)}
        </Text>
        <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: priority.color }}>{priority.label}</Text>
      </View>
    </View>
  );
}