import { Search, Star } from 'lucide-react-native';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import type { SubjectOption } from '@/lib/subjectOptions';
import { useTheme } from '@/theme';

type Props = {
  query: string;
  onQueryChange: (text: string) => void;
  subjects: SubjectOption[];
  subjectId: number | null;
  onSubjectChange: (id: number | null) => void;
  reviewOnly: boolean;
  onReviewChange: (on: boolean) => void;
};

export function NoteFilterBar({ query, onQueryChange, subjects, subjectId, onSubjectChange, reviewOnly, onReviewChange }: Props) {
  const { colors } = useTheme();

  const chip = (key: string, on: boolean, onPress: () => void, content: React.ReactNode) => (
    <Pressable
      key={key}
      onPress={onPress}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.md, paddingVertical: space.sm,
        borderRadius: radius.pill, borderWidth: 1, borderColor: on ? colors.primary : colors.border,
        backgroundColor: on ? colors.tint : 'transparent',
      }}
    >
      {content}
    </Pressable>
  );
  const label = (text: string) => <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.text }}>{text}</Text>;

  return (
    <View style={{ gap: space.md }}>
      <View
        style={{
          flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.md,
          borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
        }}
      >
        <Search size={18} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search notes"
          placeholderTextColor={colors.textMuted}
          style={{ flex: 1, paddingVertical: space.md, fontFamily: fonts.regular, fontSize: 15, color: colors.text }}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
        {chip('all', subjectId === null && !reviewOnly, () => { onSubjectChange(null); onReviewChange(false); }, label('All'))}
        {chip('review', reviewOnly, () => onReviewChange(!reviewOnly), (
          <>
            <Star size={14} color={colors.primary} fill={reviewOnly ? colors.primary : 'transparent'} />
            {label('Review')}
          </>
        ))}
        {subjects.map((s) =>
          chip(String(s.id), subjectId === s.id, () => onSubjectChange(subjectId === s.id ? null : s.id), (
            <>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: s.color }} />
              {label(s.name)}
            </>
          )),
        )}
      </ScrollView>
    </View>
  );
}