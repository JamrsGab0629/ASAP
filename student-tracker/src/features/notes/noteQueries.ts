import type { SQLiteDatabase } from 'expo-sqlite';
import type { Note, NoteFilters, NoteListItem } from './types';

type Row = Omit<Note, 'reviewFlag'> & { reviewFlag: number; subjectName: string; subjectColor: string };

const escapeLike = (text: string) => text.replace(/[\\%_]/g, (c) => `\\${c}`);

const COLUMNS = `n.id, n.subject_id AS subjectId, n.title, COALESCE(n.body, '') AS body,
  COALESCE(n.tags, '') AS tags, n.review_flag AS reviewFlag,
  COALESCE(n.updated_at, n.created_at) AS updatedAt`;

export async function listNotes(db: SQLiteDatabase, filters: NoteFilters): Promise<NoteListItem[]> {
  const where: string[] = [`n.type = 'text'`];
  const params: (string | number)[] = [];

  if (filters.subjectId !== null) {
    where.push('n.subject_id = ?');
    params.push(filters.subjectId);
  }
  if (filters.reviewOnly) where.push('n.review_flag = 1');

  const query = filters.query.trim();
  if (query) {
    const like = `%${escapeLike(query)}%`;
    where.push(`(n.title LIKE ? ESCAPE '\\' OR n.body LIKE ? ESCAPE '\\' OR n.tags LIKE ? ESCAPE '\\')`);
    params.push(like, like, like);
  }

  const rows = await db.getAllAsync<Row>(
    `SELECT ${COLUMNS}, s.name AS subjectName, s.color AS subjectColor
     FROM notes n JOIN subjects s ON s.id = n.subject_id
     WHERE ${where.join(' AND ')}
     ORDER BY COALESCE(n.updated_at, n.created_at) DESC, n.id DESC`,
    params,
  );
  return rows.map((r) => ({ ...r, reviewFlag: r.reviewFlag === 1 }));
}

export async function getNote(db: SQLiteDatabase, id: number): Promise<Note | null> {
  const row = await db.getFirstAsync<Omit<Note, 'reviewFlag'> & { reviewFlag: number }>(
    `SELECT ${COLUMNS} FROM notes n WHERE n.id = ?`,
    id,
  );
  return row ? { ...row, reviewFlag: row.reviewFlag === 1 } : null;
}