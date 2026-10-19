import { Wallet } from 'lucide-react-native';
import { toISODate } from '@/lib/dates';
import { formatPeso } from '@/lib/format';
import type { TileProvider } from '../types';

type Budget = { amount: number; start_date: string; end_date: string };

const WARNING_AT_REMAINING = 0.2; // warn when 80% is spent

export const allowanceTile: TileProvider = {
  id: 'allowance',
  label: 'Allowance',
  icon: Wallet,
  href: null,
  async load(db, today) {
    const iso = toISODate(today);
    const budget = await db.getFirstAsync<Budget>(
      `SELECT amount, start_date, end_date FROM budgets
       WHERE category IS NULL AND start_date <= ? AND end_date >= ?
       ORDER BY start_date DESC LIMIT 1`,
      iso,
      iso
    );
    if (!budget) return { text: 'Set a budget' };

    const spent = await db.getFirstAsync<{ total: number | null }>(
      `SELECT SUM(amount) AS total FROM allowance_entries
       WHERE type = 'expense' AND substr(date, 1, 10) >= ? AND substr(date, 1, 10) <= ?`,
      budget.start_date,
      budget.end_date
    );
    const left = budget.amount - (spent?.total ?? 0);
    return {
      text: left >= 0 ? `${formatPeso(left)} left` : `${formatPeso(-left)} over`,
      attention: left <= budget.amount * WARNING_AT_REMAINING,
    };
  },
};