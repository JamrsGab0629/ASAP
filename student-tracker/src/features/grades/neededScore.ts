import type { Standing } from './standing';

export type Needed =
  | { kind: 'secured' }
  | { kind: 'unreachable' }
  | { kind: 'needed'; percent: number };

/** What the remaining work must average to finish at `targetPercent`. */
export function neededOnRemaining(targetPercent: number, standing: Standing): Needed | null {
  if (standing.remainingWeight <= 0) return null;
  const needed = ((targetPercent - standing.earnedPoints) / standing.remainingWeight) * 100;
  if (needed <= 0) return { kind: 'secured' };
  if (needed > 100) return { kind: 'unreachable' };
  return { kind: 'needed', percent: Math.ceil(needed * 10) / 10 };
}