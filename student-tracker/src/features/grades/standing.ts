import type { GradeComponent, GradePeriod } from './types';

export type Standing = {
  percent: number | null; // weighted average over the parts that have scores
  earnedPoints: number; // points earned out of the whole grade (0-100)
  gradedWeight: number;
  remainingWeight: number; // weight of parts with no scores yet
};

type WeightedPart = { weight: number; percent: number | null };

/** The one weighted-average rule, used for parts within a period and for periods within a subject. */
function combine(parts: WeightedPart[]): Standing {
  let earnedPoints = 0;
  let gradedWeight = 0;
  let remainingWeight = 0;
  for (const part of parts) {
    if (part.percent === null) {
      remainingWeight += part.weight;
    } else {
      earnedPoints += (part.percent * part.weight) / 100;
      gradedWeight += part.weight;
    }
  }
  return {
    percent: gradedWeight > 0 ? (earnedPoints / gradedWeight) * 100 : null,
    earnedPoints,
    gradedWeight,
    remainingWeight,
  };
}

/** Points earned / points possible across the scored items, or null if nothing is scored. */
export function componentPercent(component: GradeComponent): number | null {
  let earned = 0;
  let possible = 0;
  for (const item of component.items) {
    if (item.score === null) continue;
    earned += item.score;
    possible += item.maxScore;
  }
  return possible > 0 ? (earned / possible) * 100 : null;
}

export const computeStanding = (components: GradeComponent[]): Standing =>
  combine(components.map((c) => ({ weight: c.weight, percent: componentPercent(c) })));

export const periodPercent = (period: GradePeriod): number | null => computeStanding(period.components).percent;

export const computeOverall = (periods: GradePeriod[]): Standing =>
  combine(periods.map((p) => ({ weight: p.weight, percent: periodPercent(p) })));

/** Final standing (percent) for each subject that has at least one scored item. */
export function standingsBySubject(periods: GradePeriod[]): Map<number, number> {
  const groups = new Map<number, GradePeriod[]>();
  for (const p of periods) groups.set(p.subjectId, [...(groups.get(p.subjectId) ?? []), p]);

  const result = new Map<number, number>();
  for (const [subjectId, group] of groups) {
    const { percent } = computeOverall(group);
    if (percent !== null) result.set(subjectId, percent);
  }
  return result;
}

export function averageStanding(periods: GradePeriod[]): number | null {
  const percents = [...standingsBySubject(periods).values()];
  return percents.length ? percents.reduce((s, p) => s + p, 0) / percents.length : null;
}