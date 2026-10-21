import { assessBudget, type BudgetAssessment } from './budgetStatus';
import type { Period, PeriodType } from './period';
import type { Entry } from './types';

export type PeriodSummary = {
  type: PeriodType;
  period: Period;
  isCurrent: boolean;
  allowance: number | null; // null = no allowance was set for this period
  extra: number;
  spent: number;
  total: number;
  left: number;
  entries: Entry[]; // newest first
  assessment: BudgetAssessment | null; // only for the current period
};

type Input = {
  type: PeriodType;
  period: Period;
  allowance: number | null;
  entries: Entry[];
  now: Date;
  isCurrent: boolean;
};

const sumOf = (entries: Entry[], type: Entry['type']) =>
  entries.filter((e) => e.type === type).reduce((sum, e) => sum + e.amount, 0);

export function buildSummary({ type, period, allowance, entries, now, isCurrent }: Input): PeriodSummary {
  const spent = sumOf(entries, 'expense');
  const extra = sumOf(entries, 'income');
  const total = (allowance ?? 0) + extra;
  return {
    type, period, isCurrent, allowance, extra, spent, total, left: total - spent, entries,
    assessment: isCurrent ? assessBudget({ total, spent, period, now }) : null,
  };
}