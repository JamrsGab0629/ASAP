import type { SQLiteDatabase } from 'expo-sqlite';
import { pickDefaultSubject } from './defaultSubject';
import { getLastSubjectId } from './lastSubjectStore';
import { getOngoingSubjectId } from './ongoingSubject';

export async function resolveDefaultSubject(
  db: SQLiteDatabase,
  subjectIds: number[],
  filterSubjectId: number | null,
): Promise<number | null> {
  return pickDefaultSubject({
    filterSubjectId,
    ongoingSubjectId: await getOngoingSubjectId(db, new Date()),
    lastUsedId: getLastSubjectId(),
    subjectIds,
  });
}