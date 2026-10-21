import type { SQLiteDatabase } from 'expo-sqlite';

// [minimum percent, equivalent], best first
const PH_SCALE: [number, string][] = [
  [97, '1.00'], [94, '1.25'], [91, '1.50'], [88, '1.75'], [85, '2.00'],
  [82, '2.25'], [79, '2.50'], [76, '2.75'], [75, '3.00'], [0, '5.00'],
];

/** Returns the id of the first scale, creating the Philippine one if none exists. */
export async function ensureDefaultScale(db: SQLiteDatabase): Promise<number> {
  const existing = await db.getFirstAsync<{ id: number }>(`SELECT id FROM grade_scales ORDER BY id LIMIT 1`);
  if (existing) return existing.id;

  let scaleId = 0;
  await db.withTransactionAsync(async () => {
    const result = await db.runAsync(
      `INSERT INTO grade_scales (name, passing_grade) VALUES (?, ?)`,
      'Philippine 1.00 – 5.00', 3,
    );
    scaleId = result.lastInsertRowId;
    for (let i = 0; i < PH_SCALE.length; i++) {
      const [min, equivalent] = PH_SCALE[i];
      const max = i === 0 ? 100 : PH_SCALE[i - 1][0];
      await db.runAsync(
        `INSERT INTO grade_scale_entries (scale_id, min_score, max_score, equivalent) VALUES (?, ?, ?, ?)`,
        scaleId, min, max, equivalent,
      );
    }
  });
  return scaleId;
}