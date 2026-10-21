import { neededOnRemaining, type Needed } from './neededScore';
import { betterEntry, equivalentFor, isPassing, scaleDirection } from './scale';
import { componentPercent, computeOverall, computeStanding, periodPercent, type Standing } from './standing';
import type { GradePeriod, GradeScale, ScaleEntry } from './types';

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

type ViewInput = { standing: Standing; pendingNames: string[]; pendingFallback: string; totalWeight: number };

function buildView(input: ViewInput, scale: GradeScale, chosenTarget: string | undefined): GradeView {
  const { standing } = input;
  const direction = scaleDirection(scale.entries);
  const entry = standing.percent === null ? null : equivalentFor(standing.percent, scale.entries);
  const passing = entry ? isPassing(entry.equivalent, scale.passingGrade, direction) : null;

  const targetOptions = scale.entries.filter((e) => isPassing(e.equivalent, scale.passingGrade, direction) !== false);
  const targetEntry =
    scale.entries.find((e) => e.equivalent === chosenTarget) ?? betterEntry(entry, scale.entries);
  const needed = targetEntry ? neededOnRemaining(targetEntry.minScore, standing) : null;
  const pendingLabel = input.pendingNames.length === 1 ? input.pendingNames[0] : input.pendingFallback;

  return { standing, entry, passing, targetOptions, targetEntry, needed, pendingLabel, totalWeight: input.totalWeight };
}

/** One period: its parts combine into the period grade. */
export function buildPeriodView(period: GradePeriod, scale: GradeScale, chosenTarget: string | undefined): GradeView {
  return buildView(
    {
      standing: computeStanding(period.components),
      pendingNames: period.components.filter((c) => componentPercent(c) === null).map((c) => c.name),
      pendingFallback: 'remaining parts',
      totalWeight: period.components.reduce((sum, c) => sum + c.weight, 0),
    },
    scale,
    chosenTarget,
  );
}

/** The whole subject: the period grades combine into the final grade. */
export function buildOverallView(periods: GradePeriod[], scale: GradeScale, chosenTarget: string | undefined): GradeView {
  return buildView(
    {
      standing: computeOverall(periods),
      pendingNames: periods.filter((p) => periodPercent(p) === null).map((p) => p.name),
      pendingFallback: 'remaining periods',
      totalWeight: periods.reduce((sum, p) => sum + p.weight, 0),
    },
    scale,
    chosenTarget,
  );
}

export type PeriodSummary = { period: GradePeriod; percent: number | null; equivalent: string | null };

export function summarizePeriods(periods: GradePeriod[], scale: GradeScale): PeriodSummary[] {
  return periods.map((period) => {
    const percent = periodPercent(period);
    return { period, percent, equivalent: percent === null ? null : equivalentFor(percent, scale.entries)?.equivalent ?? null };
  });
}