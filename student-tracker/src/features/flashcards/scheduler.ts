import type { CardStage, Rating, Sched } from './types';

export type Outcome = Sched & { dueAt: Date };

/** Decides when a card comes back. Swap this to change the study method. */
export interface Scheduler {
  next(state: Sched, rating: Rating, now: Date): Outcome;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MIN_EASE = 1.3;

const clampEase = (ease: number) => Math.max(MIN_EASE, Math.round(ease * 100) / 100);
const plain = (s: Sched): Sched => ({ stage: s.stage, intervalDays: s.intervalDays, ease: s.ease, reps: s.reps, lapses: s.lapses });
const inMs = (now: Date, ms: number) => new Date(now.getTime() + ms);

function graduate(state: Sched, days: number, now: Date): Outcome {
  return { ...plain(state), stage: 'review', intervalDays: days, reps: state.reps + 1, dueAt: inMs(now, days * DAY) };
}

/** New cards and cards being relearned move in short steps until they are answered Good or Easy. */
function learningStep(state: Sched, rating: Rating, now: Date): Outcome {
  const stage: CardStage = 'learning';
  switch (rating) {
    case 1: return { ...plain(state), stage, dueAt: inMs(now, 10 * MINUTE) };
    case 2: return { ...plain(state), stage, dueAt: inMs(now, HOUR) };
    case 3: return graduate(state, 1, now);
    case 4: return graduate(state, 4, now);
  }
}

/** Cards already on a day schedule (the SM-2 method, with Hard and Easy adjustments). */
function reviewStep(state: Sched, rating: Rating, now: Date): Outcome {
  const { intervalDays: interval, ease, reps } = state;
  const good = reps <= 1 ? 6 : Math.max(interval + 1, Math.round(interval * ease));

  if (rating === 1) {
    return { ...plain(state), stage: 'learning', intervalDays: 1, ease: clampEase(ease - 0.2), reps: 0, lapses: state.lapses + 1, dueAt: inMs(now, 10 * MINUTE) };
  }
  const days =
    rating === 2 ? Math.min(Math.max(1, Math.round(interval * 1.2)), Math.max(1, good - 1))
    : rating === 3 ? good
    : Math.max(Math.round(good * 1.3), good + 2);
  const newEase = rating === 2 ? ease - 0.15 : rating === 4 ? ease + 0.15 : ease;

  return { ...plain(state), stage: 'review', intervalDays: days, ease: clampEase(newEase), reps: reps + 1, dueAt: inMs(now, days * DAY) };
}

export const sm2Scheduler: Scheduler = {
  next: (state, rating, now) => (state.stage === 'review' ? reviewStep(state, rating, now) : learningStep(state, rating, now)),
};

/** What each of the four buttons would do right now. Used for the "10 min / 1 d / 6 d" labels. */
export function previewOutcomes(state: Sched, now: Date, scheduler: Scheduler = sm2Scheduler): Record<Rating, Outcome> {
  return { 1: scheduler.next(state, 1, now), 2: scheduler.next(state, 2, now), 3: scheduler.next(state, 3, now), 4: scheduler.next(state, 4, now) };
}