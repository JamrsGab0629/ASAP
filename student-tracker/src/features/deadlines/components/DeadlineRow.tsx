import { Check } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import { formatDueLabel } from '../dueLabel';
import type { DueDeadline } from '../upcomingDeadlines';

type Props = {
  item: DueDeadline;
  now: Date;
  done: boolean;
  onToggle: (item: DueDeadline) => void;
  onLongPress: (item: DueDeadline) => void;
};

export function DeadlineRow({ item, now, done, onToggle, onLongPress }: Props) {
  const { colors } = useTheme();
  const priorityColor = { high: colors.danger, medium: colors.warning, low: colors.success }[item.priority];

  return (
    <Pressable
      onLongPress={() => onLongPress(item)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.md,
        padding: space.lg,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        opacity: done ? 0.6 : 1,
      }}
    >
      <Pressable
        hitSlop={8}
        onPress={() => onToggle(item)}
        style={{
          width: 24, height: 24, borderRadius: 12, borderWidth: 2,
          borderColor: done ? colors.primary : colors.border,
          backgroundColor: done ? colors.primary : 'transparent',
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        {done && <Check size={14} color={colors.onPrimary} />}
      </Pressable>

      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            fontFamily: fonts.semibold, fontSize: 16, color: colors.text,
            textDecorationLine: done ? 'line-through' : 'none',
          }}
        >
          {item.title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.subjectColor }} />
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, flexShrink: 1 }}>
            {item.subjectName}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: fonts.medium, fontSize: 13,
            color: item.isOverdue && !done ? colors.danger : colors.textMuted,
          }}
        >
          {formatDueLabel(item, now)}
        </Text>
      </View>

      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: priorityColor }} />
    </Pressable>
  );
}