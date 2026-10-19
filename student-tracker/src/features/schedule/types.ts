export type ClassDraft =
  | { kind: 'regular'; subjectId: number; days: number[]; start: string; end: string; room: string | null }
  | { kind: 'makeup'; subjectId: number; date: string; start: string; end: string; room: string | null };

export type SubjectOption = { id: number; name: string; color: string };