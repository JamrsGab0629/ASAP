import type { SQLiteDatabase } from 'expo-sqlite';
import type { GradeComponent, GradeItem, GradePeriod, GradeScale } from './types';

type PeriodRow = Omit<GradePeriod, 'components'>;
type ComponentRow = Omit<GradeComponent, 'items'>;

function groupBy<T, K>(rows: T[], key: (row: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const row of rows) {
    const list = groups.get(key(row)) ?? [];
    list.push(row);
    groups.set(key(row), list);
  }
  return groups;
}

async function attachChildren(db: SQLiteDatabase, periods: PeriodRow[]): Promise<GradePeriod[]> {
  const components = await db.getAllAsync<ComponentRow>(
    `SELECT id, period_id AS periodId, name, weight FROM grade_components ORDER BY id`,
  );
  const items = await db.getAllAsync<GradeItem>(
    `SELECT id, component_id AS componentId, title, score, max_score AS maxScore FROM grade_items ORDER BY id`,
  );
  const itemsByComponent = groupBy(items, (i) => i.componentId);
  const componentsByPeriod = groupBy(components, (c) => c.periodId);

  return periods.map((period) => ({
    ...period,
    components: (componentsByPeriod.get(period.id) ?? []).map((c) => ({ ...c, items: itemsByComponent.get(c.id) ?? [] })),
  }));
}

export async function listPeriods(db: SQLiteDatabase, subjectId: number): Promise<GradePeriod[]> {
  const rows = await db.getAllAsync<PeriodRow>(
    `SELECT id, subject_id AS subjectId, name, weight FROM grade_periods WHERE subject_id = ? ORDER BY id`,
    subjectId,
  );
  return attachChildren(db, rows);
}

export async function listAllPeriods(db: SQLiteDatabase): Promise<GradePeriod[]> {
  const rows = await db.getAllAsync<PeriodRow>(
    `SELECT id, subject_id AS subjectId, name, weight FROM grade_periods ORDER BY id`,
  );
  return attachChildren(db, rows);
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