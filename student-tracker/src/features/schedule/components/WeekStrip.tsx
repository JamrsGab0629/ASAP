import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { addDays } from '@/lib/dates';
import { useTheme } from '@/theme';
import { DAY_LETTERS, getWeekDates, isSameDay } from '../weekDates';

type Props = { selected: Date; today: Date; onSelect: (d: Date) => void };

export function WeekStrip({ selected, today, onSelect }: Props) {
  const { colors } = useTheme();
  const week = getWeekDates(selected);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs }}>
      <Pressable hitSlop={8} onPress={() => onSelect(addDays(selected, -7))}>
        <ChevronLeft size={20} color={colors.textMuted} />
      </Pressable>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        {week.map((d) => {
          const active = isSameDay(d, selected);
          const isToday = isSameDay(d, today);
          return (
            <Pressable
              key={d.toISOString()}
              onPress={() => onSelect(d)}
              style={{
                width: 40,
                paddingVertical: space.sm,
                alignItems: 'center',
                borderRadius: radius.md,
                backgroundColor: active ? colors.primary : 'transparent',
              }}
            >
              <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: active ? colors.onPrimary : colors.textMuted }}>
                {DAY_LETTERS[d.getDay()]}
              </Text>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: active ? colors.onPrimary : colors.text }}>
                {d.getDate()}
              </Text>
              <View
                style={{
                  width: 4, height: 4, borderRadius: 2, marginTop: 2,
                  backgroundColor: isToday ? (active ? colors.onPrimary : colors.primary) : 'transparent',
                }}
              />
            </Pressable>
          );
        })}
      </View>
      <Pressable hitSlop={8} onPress={() => onSelect(addDays(selected, 7))}>
        <ChevronRight size={20} color={colors.textMuted} />
      </Pressable>
    </View>
  );
}