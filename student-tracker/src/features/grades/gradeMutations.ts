import type { SQLiteDatabase } from 'expo-sqlite';
import type { ComponentPreset } from './presets';
import type { ComponentDraft, ItemDraft } from './types';

export async function addComponent(db: SQLiteDatabase, d: ComponentDraft): Promise<void> {
  await db.runAsync(`INSERT INTO grade_components (subject_id, name, weight) VALUES (?, ?, ?)`, d.subjectId, d.name, d.weight);
}

export async function addComponentsFromPreset(db: SQLiteDatabase, subjectId: number, preset: ComponentPreset): Promise<void> {
  await db.withTransactionAsync(async () => {
    for (const part of preset.parts) await addComponent(db, { subjectId, name: part.name, weight: part.weight });
  });
}

export async function updateComponent(db: SQLiteDatabase, id: number, d: ComponentDraft): Promise<void> {
  await db.runAsync(`UPDATE grade_components SET name = ?, weight = ? WHERE id = ?`, d.name, d.weight, id);
}

export async function deleteComponent(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync(`DELETE FROM grade_components WHERE id = ?`, id);
}

export async function addItem(db: SQLiteDatabase, d: ItemDraft): Promise<void> {
  await db.runAsync(
    `INSERT INTO grade_items (component_id, title, score, max_score) VALUES (?, ?, ?, ?)`,
    d.componentId, d.title, d.score, d.maxScore,
  );
}

export async function updateItem(db: SQLiteDatabase, id: number, d: ItemDraft): Promise<void> {
  await db.runAsync(`UPDATE grade_items SET title = ?, score = ?, max_score = ? WHERE id = ?`, d.title, d.score, d.maxScore, id);
}

export async function deleteItem(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync(`DELETE FROM grade_items WHERE id = ?`, id);
}