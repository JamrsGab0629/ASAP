import type { SQLiteDatabase } from 'expo-sqlite';
import type { GradeComponent, GradeItem, GradeScale } from './types';

type ComponentRow = Omit<GradeComponent, 'items'>;

async function attachItems(db: SQLiteDatabase, rows: ComponentRow[]): Promise<GradeComponent[]> {
  const items = await db.getAllAsync<GradeItem>(
    `SELECT id, component_id AS componentId, title, score, max_score AS maxScore FROM grade_items ORDER BY id`,
  );
  const byComponent = new Map<number, GradeItem[]>();
  for (const item of items) {
    const list = byComponent.get(item.componentId) ?? [];
    list.push(item);
    byComponent.set(item.componentId, list);
  }
  return rows.map((row) => ({ ...row, items: byComponent.get(row.id) ?? [] }));
}

export async function listComponents(db: SQLiteDatabase, subjectId: number): Promise<GradeComponent[]> {
  const rows = await db.getAllAsync<ComponentRow>(
    `SELECT id, subject_id AS subjectId, name, weight FROM grade_components WHERE subject_id = ? ORDER BY id`,
    subjectId,
  );
  return attachItems(db, rows);
}

export async function listAllComponents(db: SQLiteDatabase): Promise<GradeComponent[]> {
  const rows = await db.getAllAsync<ComponentRow>(
    `SELECT id, subject_id AS subjectId, name, weight FROM grade_components ORDER BY id`,
  );
  return attachItems(db, rows);
}

export async function loadScale(db: SQLiteDatabase, scaleId: number): Promise<GradeScale> {
  const scale = await db.getFirstAsync<{ name: string; passing_grade: number | null }>(
    `SELECT name, passing_grade FROM grade_scales WHERE id = ?`,
    scaleId,
  );
  const entries = await db.getAllAsync<{ minScore: number; equivalent: string }>(
    `SELECT min_score AS minScore, equivalent FROM grade_scale_entries WHERE scale_id = ? ORDER BY min_score DESC`,
    scaleId,
  );
  return { id: scaleId, name: scale?.name ?? '', passingGrade: scale?.passing_grade ?? null, entries };
}