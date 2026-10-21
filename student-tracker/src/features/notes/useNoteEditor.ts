import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { setLastSubjectId } from './lastSubjectStore';
import { deleteNote, saveReviewFlag, updateNote } from './noteMutations';
import type { Note, NoteDraft } from './types';
import { useAutosave } from './useAutosave';

export function useNoteEditor(note: Note) {
  const db = useSQLiteContext();
  const router = useRouter();
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [subjectId, setSubjectId] = useState(note.subjectId);
  const [starred, setStarred] = useState(note.reviewFlag);

  const draft = useMemo<NoteDraft>(() => ({ title, body, subjectId }), [title, body, subjectId]);
  const flush = useAutosave(draft, (d) => updateNote(db, note.id, d));

  const latest = useRef(draft);
  latest.current = draft;

  // On leaving: save what's pending, and throw away a note that is still empty.
  useEffect(
    () => () => {
      (async () => {
        await flush();
        if (!latest.current.title.trim() && !latest.current.body.trim()) await deleteNote(db, note.id);
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const changeSubject = (id: number) => {
    setSubjectId(id);
    setLastSubjectId(id);
  };

  const toggleStar = async () => {
    const next = !starred;
    setStarred(next);
    await saveReviewFlag(db, note.id, next);
  };

  const remove = () =>
    Alert.alert('Delete this note?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteNote(db, note.id);
          router.back();
        },
      },
    ]);

  return { title, setTitle, body, setBody, subjectId, changeSubject, starred, toggleStar, remove };
}