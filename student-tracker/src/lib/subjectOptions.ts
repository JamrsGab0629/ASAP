import type { SQLiteDatabase } from 'expo-sqlite';

export type SubjectOption = { id: number; name: string; color: string };

export function listSubjectOptions(db: SQLiteDatabase): Promise<SubjectOption[]> {
  return db.getAllAsync<SubjectOption>(`SELECT id, name, color FROM subjects ORDER BY name`);
}