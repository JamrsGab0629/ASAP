import { neededOnRemaining, type Needed } from './neededScore';
import { betterEntry, equivalentFor, isPassing, scaleDirection } from './scale';
import { componentPercent, computeStanding, type Standing } from './standing';
import type { GradeComponent, GradeScale, ScaleEntry } from './types';

export type GradeView = {
  standing: Standing;
  entry: ScaleEntry | null;
  passing: boolean | null;
  targetOptions: ScaleEntry[];
  targetEntry: ScaleEntry | null;
  needed: Needed | null;
  pendingLabel: string;
  totalWeight: number;
};

export function buildGradeView(
  components: GradeComponent[],
  scale: GradeScale,
  chosenTarget: string | undefined,
): GradeView {
  const standing = computeStanding(components);
  const direction = scaleDirection(scale.entries);
  const entry = standing.percent === null ? null : equivalentFor(standing.percent, scale.entries);
  const passing = entry ? isPassing(entry.equivalent, scale.passingGrade, direction) : null;

  const targetOptions = scale.entries.filter(
    (e) => isPassing(e.equivalent, scale.passingGrade, direction) !== false,
  );
  const targetEntry =
    scale.entries.find((e) => e.equivalent === chosenTarget) ?? betterEntry(entry, scale.entries);
  const needed = targetEntry ? neededOnRemaining(targetEntry.minScore, standing) : null;

  const pending = components.filter((c) => componentPercent(c) === null);
  const pendingLabel = pending.length === 1 ? pending[0].name : 'remaining components';
  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);

  return { standing, entry, passing, targetOptions, targetEntry, needed, pendingLabel, totalWeight };
}