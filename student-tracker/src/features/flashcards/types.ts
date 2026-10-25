export type Rating = 1 | 2 | 3 | 4;

/** new = never studied, learning = being (re)learned in short steps, review = on a day-based schedule */
export type CardStage = 'new' | 'learning' | 'review';

/** The part of a card the scheduler cares about. */
export type Sched = {
  stage: CardStage;
  intervalDays: number;
  ease: number;
  reps: number;
  lapses: number;
};

export type Card = Sched & {
  id: number;
  subjectId: number;
  noteId: number | null;
  front: string;
  back: string;
  dueAt: string; // 'YYYY-MM-DDTHH:mm' local time
};

export type CardDraft = { subjectId: number; front: string; back: string; noteId?: number | null };

export type DeckSummary = {
  subjectId: number;
  name: string;
  color: string;
  total: number;
  due: number; // learning and review cards that are due now
  fresh: number; // cards never studied
};