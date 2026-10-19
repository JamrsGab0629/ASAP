import type { SQLiteDatabase } from 'expo-sqlite';

export async function initDb(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL, teacher TEXT, units INTEGER DEFAULT 3, color TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      type TEXT NOT NULL DEFAULT 'regular',
      day_of_week INTEGER, date TEXT, start TEXT NOT NULL, end TEXT NOT NULL,
      room TEXT, notification_id TEXT
    );
    CREATE TABLE IF NOT EXISTS schedule_exceptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      schedule_id INTEGER NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
      date TEXT NOT NULL, status TEXT NOT NULL,
      new_start TEXT, new_end TEXT, new_room TEXT
    );
    CREATE TABLE IF NOT EXISTS deadlines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      title TEXT NOT NULL, due_date TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'medium', status TEXT NOT NULL DEFAULT 'open',
      notification_id TEXT
    );
    CREATE TABLE IF NOT EXISTS grade_scales (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, passing_grade REAL
    );
    CREATE TABLE IF NOT EXISTS grade_scale_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scale_id INTEGER NOT NULL REFERENCES grade_scales(id) ON DELETE CASCADE,
      min_score REAL NOT NULL, max_score REAL NOT NULL, equivalent TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      scale_id INTEGER REFERENCES grade_scales(id) ON DELETE SET NULL,
      title TEXT NOT NULL, weight REAL NOT NULL, score REAL, max_score REAL NOT NULL DEFAULT 100
    );
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      title TEXT NOT NULL, type TEXT NOT NULL DEFAULT 'text',
      body TEXT, file_path TEXT, tags TEXT, review_flag INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS decks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE, title TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deck_id INTEGER NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
      front TEXT NOT NULL, back TEXT NOT NULL, next_review TEXT,
      interval REAL NOT NULL DEFAULT 0, ease REAL NOT NULL DEFAULT 2.5,
      times_missed INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      period_type TEXT NOT NULL, start_date TEXT NOT NULL, end_date TEXT NOT NULL,
      amount REAL NOT NULL, category TEXT
    );
    CREATE TABLE IF NOT EXISTS allowance_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL, type TEXT NOT NULL, category TEXT, date TEXT NOT NULL, note TEXT
    );
    CREATE TABLE IF NOT EXISTS tuition_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      installment TEXT NOT NULL, due_date TEXT NOT NULL, amount REAL NOT NULL,
      paid INTEGER NOT NULL DEFAULT 0
    );
  `);
}