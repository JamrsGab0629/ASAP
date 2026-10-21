import { defuzzify, fuzzify, infer, trapezoid, triangle, type Degrees, type FuzzyRule, type FuzzyVariables } from './fuzzy';

export type RiskTerm = 'comfortable' | 'watch' | 'tight' | 'danger';

/**
 * pace      = share of the allowance spent minus share of the period gone.
 *             Negative means spending slower than the calendar.
 * remaining = share of the allowance still left (negative when overspent).
 */
const VARIABLES: FuzzyVariables = {
  pace: {
    under: trapezoid(-1, -1, -0.15, -0.02),
    onPace: triangle(-0.12, 0, 0.12),
    over: trapezoid(0.02, 0.15, 1, 1),
  },
  remaining: {
    plenty: trapezoid(0.35, 0.6, 1, 1),
    some: triangle(0.1, 0.35, 0.6),
    little: trapezoid(-1, -1, 0.1, 0.3),
  },
};

const RULES: FuzzyRule<RiskTerm>[] = [
  { when: { pace: 'under', remaining: 'plenty' }, then: 'comfortable' },
  { when: { pace: 'under', remaining: 'some' }, then: 'comfortable' },
  { when: { pace: 'under', remaining: 'little' }, then: 'watch' },
  { when: { pace: 'onPace', remaining: 'plenty' }, then: 'comfortable' },
  { when: { pace: 'onPace', remaining: 'some' }, then: 'watch' },
  { when: { pace: 'onPace', remaining: 'little' }, then: 'tight' },
  { when: { pace: 'over', remaining: 'plenty' }, then: 'watch' },
  { when: { pace: 'over', remaining: 'some' }, then: 'tight' },
  { when: { pace: 'over', remaining: 'little' }, then: 'danger' },
];

const CENTERS: Record<RiskTerm, number> = { comfortable: 10, watch: 40, tight: 70, danger: 95 };

export function scoreBudget(pace: number, remaining: number): { score: number; degrees: Degrees } {
  const degrees = fuzzify(VARIABLES, { pace, remaining });
  return { score: defuzzify(infer(RULES, degrees), CENTERS), degrees };
}