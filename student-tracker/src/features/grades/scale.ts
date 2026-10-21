import type { ScaleEntry } from './types';

export type Direction = 'lower-better' | 'higher-better';

/** 1.00 beats 5.00 on the Philippine scale, 4.0 beats 0.0 on a GPA scale. */
export function scaleDirection(entries: ScaleEntry[]): Direction {
  if (entries.length < 2) return 'higher-better';
  const best = Number(entries[0].equivalent);
  const worst = Number(entries[entries.length - 1].equivalent);
  return best < worst ? 'lower-better' : 'higher-better';
}

/** Expects entries sorted best first. */
export function equivalentFor(percent: number, entries: ScaleEntry[]): ScaleEntry | null {
  return entries.find((e) => percent >= e.minScore) ?? null;
}

/** null when the scale has no usable passing grade. */
export function isPassing(equivalent: string, passingGrade: number | null, direction: Direction): boolean | null {
  const value = Number(equivalent);
  if (passingGrade === null || Number.isNaN(value)) return null;
  return direction === 'lower-better' ? value <= passingGrade : value >= passingGrade;
}

/** The next entry up from `current`, or null if already at the top. */
export function betterEntry(current: ScaleEntry | null, entries: ScaleEntry[]): ScaleEntry | null {
  if (!current) return null;
  const index = entries.indexOf(current);
  return index > 0 ? entries[index - 1] : null;
}