import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert } from 'react-native';
import type { SubjectOption } from '@/lib/subjectOptions';
import { createNote } from './noteMutations';
import { resolveDefaultSubject } from './resolveSubject';

/** Creates an empty note in the best-guess subject and opens it. */
export function useCreateNote(subjects: SubjectOption[], filterSubjectId: number | null) {
  const db = useSQLiteContext();
  const router = useRouter();

  return async () => {
    const subjectId = await resolveDefaultSubject(db, subjects.map((s) => s.id), filterSubjectId);
    if (subjectId === null) return Alert.alert('Add a subject first', 'Notes are filed under a subject.');

    const id = await createNote(db, subjectId);
    router.push({ pathname: '/note/[id]', params: { id: String(id), isNew: '1' } });
  };
}