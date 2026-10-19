import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import { DAY_NAMES } from '../weekDates';

type Props = { selected: number[]; onToggle: (day: number) => void };

export function DayChips({ selected, onToggle }: Props) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
      {DAY_NAMES.map((name, day) => {
        const on = selected.includes(day);
        return (
          <Pressable
            key={name}
            onPress={() => onToggle(day)}
            style={{
              paddingHorizontal: space.md,
              paddingVertical: space.sm,
              borderRadius: radius.pill,
              borderWidth: 1,
              borderColor: on ? colors.primary : colors.border,
              backgroundColor: on ? colors.primary : 'transparent',
            }}
          >
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: on ? colors.onPrimary : colors.text }}>
              {name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}