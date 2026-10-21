import type { GradeComponent } from './types';

export type Standing = {
  percent: number | null; // average over parts that have scores
  earnedPoints: number; // points earned out of the whole grade (0-100)
  gradedWeight: number;
  remainingWeight: number; // weight of parts with no scores yet
};

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

export function computeStanding(components: GradeComponent[]): Standing {
  let earnedPoints = 0;
  let gradedWeight = 0;
  let remainingWeight = 0;
  for (const c of components) {
    const percent = componentPercent(c);
    if (percent === null) {
      remainingWeight += c.weight;
    } else {
      earnedPoints += (percent * c.weight) / 100;
      gradedWeight += c.weight;
    }
  }
  return {
    percent: gradedWeight > 0 ? (earnedPoints / gradedWeight) * 100 : null,
    earnedPoints,
    gradedWeight,
    remainingWeight,
  };
}

/** Current standing (percent) for each subject that has at least one scored item. */
export function standingsBySubject(components: GradeComponent[]): Map<number, number> {
  const groups = new Map<number, GradeComponent[]>();
  for (const c of components) groups.set(c.subjectId, [...(groups.get(c.subjectId) ?? []), c]);

  const result = new Map<number, number>();
  for (const [subjectId, group] of groups) {
    const { percent } = computeStanding(group);
    if (percent !== null) result.set(subjectId, percent);
  }
  return result;
}

export function averageStanding(components: GradeComponent[]): number | null {
  const percents = [...standingsBySubject(components).values()];
  return percents.length ? percents.reduce((s, p) => s + p, 0) / percents.length : null;
}