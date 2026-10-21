import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert } from 'react-native';
import type { SubjectOption } from '@/lib/subjectOptions';
import { pickDefaultSubject } from './defaultSubject';
import { getLastSubjectId } from './lastSubjectStore';
import { createNote } from './noteMutations';
import { getOngoingSubjectId } from './ongoingSubject';

/** Creates an empty note in the best-guess subject and opens it. */
export function useCreateNote(subjects: SubjectOption[], filterSubjectId: number | null) {
  const db = useSQLiteContext();
  const router = useRouter();

  return async () => {
    const subjectId = pickDefaultSubject({
      filterSubjectId,
      ongoingSubjectId: await getOngoingSubjectId(db, new Date()),
      lastUsedId: getLastSubjectId(),
      subjectIds: subjects.map((s) => s.id),
    });
    if (subjectId === null) return Alert.alert('Add a subject first', 'Notes are filed under a subject.');

    const id = await createNote(db, subjectId);
    router.push({ pathname: '/note/[id]', params: { id: String(id), isNew: '1' } });
  };
}