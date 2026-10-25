import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { listNotes } from '@/features/notes/noteQueries';
import type { NoteListItem } from '@/features/notes/types';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';

/** Lets the student choose which note to scan when they start from the Flashcards screen. */
export function NotePicker({ onPick }: { onPick: (noteId: number) => void }) {
  const { colors } = useTheme();
  const db = useSQLiteContext();
  const [notes, setNotes] = useState<NoteListItem[]>([]);

  useEffect(() => {
    listNotes(db, { subjectId: null, reviewOnly: false, query: '' }).then(setNotes);
  }, [db]);

  if (notes.length === 0) {
    return (
      <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, textAlign: 'center', marginTop: space.xxl }}>
        No notes yet. Write or import one first.
      </Text>
    );
  }

  return (
    <View style={{ gap: space.md }}>
      {notes.map((note) => (
        <Pressable
          key={note.id}
          onPress={() => onPick(note.id)}
          style={{ padding: space.lg, gap: space.xs, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}
        >
          <Text numberOfLines={1} style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.text }}>{note.title || 'Untitled'}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>{note.subjectName}</Text>
        </Pressable>
      ))}
    </View>
  );
}