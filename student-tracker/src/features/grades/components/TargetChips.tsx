import { Pressable, ScrollView, Text } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { ScaleEntry } from '../types';

type Props = { options: ScaleEntry[]; selected: string | null; onSelect: (equivalent: string) => void };

export function TargetChips({ options, selected, onSelect }: Props) {
  const { colors } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
      {options.map((o) => {
        const on = o.equivalent === selected;
        return (
          <Pressable
            key={o.equivalent}
            onPress={() => onSelect(o.equivalent)}
            style={{
              paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.pill,
              borderWidth: 1, borderColor: on ? colors.primary : colors.border,
              backgroundColor: on ? colors.primary : 'transparent',
            }}
          >
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: on ? colors.onPrimary : colors.text }}>
              {o.equivalent}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}