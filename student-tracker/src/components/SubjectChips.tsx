import { Pressable, ScrollView, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { SubjectOption } from '../features/schedule/types';

type Props = { subjects: SubjectOption[]; selectedId: number | null; onSelect: (id: number) => void };

export function SubjectChips({ subjects, selectedId, onSelect }: Props) {
  const { colors } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
      {subjects.map((s) => {
        const on = s.id === selectedId;
        return (
          <Pressable
            key={s.id}
            onPress={() => onSelect(s.id)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: space.sm,
              paddingHorizontal: space.md,
              paddingVertical: space.sm,
              borderRadius: radius.pill,
              borderWidth: 1,
              borderColor: on ? colors.primary : colors.border,
              backgroundColor: on ? colors.tint : 'transparent',
            }}
          >
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: s.color }} />
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.text }}>{s.name}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}