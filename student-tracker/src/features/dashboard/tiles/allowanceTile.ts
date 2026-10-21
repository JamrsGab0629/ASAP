import { Wallet } from 'lucide-react-native';
import { loadPeriodSummary } from '@/features/allowance/loadSummary';
import { formatPeso } from '@/lib/format';
import type { TileProvider } from '../types';

export const allowanceTile: TileProvider = {
  id: 'allowance',
  label: 'Allowance',
  icon: Wallet,
  href: '/allowance',
  async load(db, today) {
    const summary = await loadPeriodSummary(db, today, 0);
    if (!summary) return { text: 'Set your allowance' };

    const status = summary.assessment?.status;
    return {
      text: summary.left >= 0 ? `${formatPeso(summary.left)} left` : `${formatPeso(-summary.left)} over`,
      attention: summary.left < 0 || status === 'tight' || status === 'danger',
    };
  },
};