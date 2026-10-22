export type Note = {
  id: number;
  subjectId: number;
  title: string;
  body: string;
  tags: string; // comma-separated, lowercase, no '#'
  reviewFlag: boolean;
  updatedAt: string; // 'YYYY-MM-DD HH:MM:SS' local time
  filePath: string | null; // stored copy of an imported file, relative to the app's documents folder
};

export type NoteListItem = Note & { subjectName: string; subjectColor: string };

export type NoteFilters = { query: string; subjectId: number | null; reviewOnly: boolean };

export type NoteDraft = { title: string; body: string; subjectId: number };