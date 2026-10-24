import { Pressable, ScrollView, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import type { SubjectOption } from '@/lib/subjectOptions';
import { useTheme } from '@/theme';

type Props = { subjects: SubjectOption[]; selectedId: number | null; onSelect: (id: number | null) => void };

export function SubjectFilter({ subjects, selectedId, onSelect }: Props) {
  const { colors } = useTheme();
  const chip = (key: string, label: string, id: number | null, dot?: string) => {
    const active = selectedId === id;
    return (
      <Pressable
        key={key}
        onPress={() => onSelect(id)}
        style={{
          flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.sm, paddingHorizontal: space.lg,
          borderRadius: radius.pill, borderWidth: 1, borderColor: active ? colors.primary : colors.border,
          backgroundColor: active ? colors.tint : 'transparent',
        }}
      >
        {dot ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dot }} /> : null}
        <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.text }}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
      {chip('all', 'All', null)}
      {subjects.map((s) => chip(String(s.id), s.name, s.id, s.color))}
    </ScrollView>
  );
}