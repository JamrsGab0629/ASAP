import { formatPeso } from '@/lib/format';
import { formatShortDate, minutesOfDay, toISODate } from '@/lib/dates';
import { scoreBudget } from './budgetFuzzy';
import type { Degrees } from './fuzzy';
import { daysBetween, parseISODate, type Period } from './period';

export type BudgetStatus = 'comfortable' | 'watch' | 'tight' | 'danger';

export type BudgetAssessment = {
  status: BudgetStatus;
  label: string;
  score: number; // 0 (relaxed) to 100 (out of money)
  message: string;
  reasons: string[];
  dailyLimit: number;
  burnRate: number;
};

const LABELS: Record<BudgetStatus, string> = {
  comfortable: 'On track', watch: 'Keep an eye', tight: 'Tight', danger: 'Almost out',
};

const REASON_TEXT: Record<string, Record<string, string>> = {
  pace: {
    under: 'Spending slower than the calendar',
    onPace: 'Spending in step with the calendar',
    over: 'Spending faster than the calendar',
  },
  remaining: { plenty: 'Plenty of money left', some: 'Some money left', little: 'Little money left' },
};

const clamp = (x: number, low: number, high: number) => Math.min(high, Math.max(low, x));

function statusFromScore(score: number): BudgetStatus {
  if (score < 25) return 'comfortable';
  if (score < 55) return 'watch';
  if (score < 80) return 'tight';
  return 'danger';
}

function strongestReasons(degrees: Degrees): string[] {
  return Object.entries(degrees).map(([variable, terms]) => {
    const [term, degree] = Object.entries(terms).sort((a, b) => b[1] - a[1])[0];
    return `${REASON_TEXT[variable][term]} · ${Math.round(degree * 100)}%`;
  });
}

function adviceFor(status: BudgetStatus, left: number, dailyLimit: number, until: string): string {
  if (left < 0) return `You're ${formatPeso(-left)} over this allowance.`;
  if (status === 'danger') {
    return left === 0 ? "You've used up this allowance." : `Almost out. ${formatPeso(dailyLimit)} a day at most until ${until}.`;
  }
  if (status === 'tight') return `Spending is ahead of schedule. Stay under ${formatPeso(dailyLimit)} a day to last until ${until}.`;
  if (status === 'watch') return `Keep an eye on it. About ${formatPeso(dailyLimit)} a day keeps you on track until ${until}.`;
  return "You're spending slower than the calendar. Nice pace.";
}

type Input = { total: number; spent: number; period: Period; now: Date };

export function assessBudget({ total, spent, period, now }: Input): BudgetAssessment | null {
  if (total <= 0) return null;

  const totalDays = daysBetween(period.start, period.end) + 1;
  const daysSinceStart = Math.max(0, daysBetween(period.start, toISODate(now)));
  const timeFraction = clamp((daysSinceStart + minutesOfDay(now) / 1440) / totalDays, 0.02, 1);
  const spentFraction = spent / total;

  const { score, degrees } = scoreBudget(clamp(spentFraction - timeFraction, -1, 1), clamp(1 - spentFraction, -1, 1));
  const status = statusFromScore(score);

  const left = total - spent;
  const daysRemaining = Math.max(1, totalDays - daysSinceStart);
  const dailyLimit = left > 0 ? left / daysRemaining : 0;
  const until = totalDays === 1 ? 'the end of today' : formatShortDate(parseISODate(period.end));

  return {
    status,
    label: LABELS[status],
    score,
    message: adviceFor(status, left, dailyLimit, until),
    reasons: strongestReasons(degrees),
    dailyLimit,
    burnRate: spent / (daysSinceStart + 1),
  };
}