import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { ScheduledClass } from '../classesForDate';
import { fromHHMM, to12h } from '../../../lib/clock';

type Props = { item: ScheduledClass; onLongPress: (item: ScheduledClass) => void };

export function ClassRow({ item, onLongPress }: Props) {
  const { colors } = useTheme();
  const badge = item.isMakeup ? 'Makeup' : item.isMoved ? 'Moved' : null;
  const details = [item.room, item.teacher].filter(Boolean).join(' · ');

  return (
    <Pressable
      onLongPress={() => onLongPress(item)}
      style={{
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
      }}
    >
      <View style={{ width: 5, backgroundColor: item.subjectColor }} />
      <View style={{ flex: 1, padding: space.lg, gap: 2 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.text, flexShrink: 1 }}>
            {item.subjectName}
          </Text>
          {badge && (
            <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: colors.warning }}>{badge}</Text>
          )}
        </View>
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>
          {to12h(fromHHMM(item.start))} – {to12h(fromHHMM(item.end))}
        </Text>
        {details ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>{details}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}