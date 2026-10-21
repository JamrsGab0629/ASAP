import { Link, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts, space } from '@/constants/theme';
import { NoteCard } from '@/features/notes/components/NoteCard';
import { NoteFilterBar } from '@/features/notes/components/NoteFilterBar';
import { saveReviewFlag } from '@/features/notes/noteMutations';
import type { NoteListItem } from '@/features/notes/types';
import { useCreateNote } from '@/features/notes/useCreateNote';
import { useNotes } from '@/features/notes/useNotes';
import { useDebounced } from '@/hooks/useDebounced';
import { useSubjectOptions } from '@/hooks/useSubjectOptions';
import { useTheme } from '@/theme';

export default function NotesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const db = useSQLiteContext();
  const subjects = useSubjectOptions();

  const [query, setQuery] = useState('');
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [reviewOnly, setReviewOnly] = useState(false);

  const { notes, reload } = useNotes({ query: useDebounced(query), subjectId, reviewOnly });
  const createNote = useCreateNote(subjects, subjectId);
  const filtering = query.trim() !== '' || subjectId !== null || reviewOnly;
  const today = new Date();

  const toggleReview = async (note: NoteListItem) => {
    await saveReviewFlag(db, note.id, !note.reviewFlag);
    reload();
  };

  const empty =
    subjects.length === 0 ? (
      <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, textAlign: 'center', marginTop: space.xxl }}>
        Add a subject first, then your notes can be filed under it.{' '}
        <Link href="/subjects" style={{ color: colors.primary }}>Open Subjects</Link>
      </Text>
    ) : (
      <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, textAlign: 'center', marginTop: space.xxl }}>
        {filtering ? 'No notes match.' : 'No notes yet. Tap + to write your first.'}
      </Text>
    );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={notes}
        keyExtractor={(n) => String(n.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: space.xl, paddingTop: insets.top + space.lg, gap: space.md }}
        ListHeaderComponent={
          <View style={{ gap: space.lg, marginBottom: space.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.serif, fontSize: 28, color: colors.text }}>Notes</Text>
              <Pressable
                onPress={createNote}
                accessibilityLabel="New note"
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={20} color={colors.onPrimary} />
              </Pressable>
            </View>
            <NoteFilterBar
              query={query}
              onQueryChange={setQuery}
              subjects={subjects}
              subjectId={subjectId}
              onSubjectChange={setSubjectId}
              reviewOnly={reviewOnly}
              onReviewChange={setReviewOnly}
            />
          </View>
        }
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            today={today}
            onPress={(n) => router.push({ pathname: '/note/[id]', params: { id: String(n.id) } })}
            onToggleReview={toggleReview}
          />
        )}
        ListEmptyComponent={empty}
      />
    </View>
  );
}