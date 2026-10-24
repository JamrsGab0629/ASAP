export type Highlight = { id: number; noteId: number; text: string };

/** A piece of the note body. highlightId is null for plain text. */
export type Run = { text: string; highlightId: number | null };