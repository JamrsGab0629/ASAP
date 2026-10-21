import { Pressable, ScrollView, Text } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';

type Props = { options: string[]; selected: string | null; onSelect: (value: string) => void };

export function CategoryChips({ options, selected, onSelect }: Props) {
  const { colors } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
      {options.map((option) => {
        const on = option === selected;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            style={{
              paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.pill, borderWidth: 1,
              borderColor: on ? colors.primary : colors.border, backgroundColor: on ? colors.primary : 'transparent',
            }}
          >
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: on ? colors.onPrimary : colors.text }}>{option}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}