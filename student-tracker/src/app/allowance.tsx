import { Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts, space } from '@/constants/theme';
import { AllowanceSheet } from '@/features/allowance/components/AllowanceSheet';
import { BalanceCard } from '@/features/allowance/components/BalanceCard';
import { EmptyAllowance } from '@/features/allowance/components/EmptyAllowance';
import { EntryRow } from '@/features/allowance/components/EntryRow';
import { EntrySheet } from '@/features/allowance/components/EntrySheet';
import { PeriodNav } from '@/features/allowance/components/PeriodNav';
import { StatGrid, type Stat } from '@/features/allowance/components/StatGrid';
import { groupEntriesByDay } from '@/features/allowance/groupEntries';
import { periodLabel, THIS_PERIOD } from '@/features/allowance/period';
import type { PeriodSummary } from '@/features/allowance/summary';
import type { Entry } from '@/features/allowance/types';
import { useAllowance } from '@/features/allowance/useAllowance';
import { useAllowanceActions } from '@/features/allowance/useAllowanceActions';
import { formatPeso } from '@/lib/format';
import { useTheme } from '@/theme';

type Sheet = { kind: 'entry'; initial: Entry | null } | { kind: 'allowance' };

function amountStats(s: PeriodSummary): Stat[] {
  const stats: Stat[] = [{ label: 'Allowance', value: s.allowance === null ? '—' : formatPeso(s.allowance) }];
  if (s.extra > 0) stats.push({ label: 'Extra money', value: `+${formatPeso(s.extra)}` });
  stats.push({ label: 'Spent', value: formatPeso(s.spent) });
  return stats;
}

function paceStats(s: PeriodSummary): Stat[] {
  if (!s.assessment) return [];
  const unit = s.type === 'day' ? 'today' : '/ day';
  return [
    { label: 'Daily limit', value: s.type === 'day' ? formatPeso(s.assessment.dailyLimit) : `${formatPeso(s.assessment.dailyLimit)} ${unit}` },
    { label: 'Spending rate', value: `${formatPeso(s.assessment.burnRate)} / day` },
  ];
}

export default function AllowanceScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [offset, setOffset] = useState(0);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const { summary, loaded, reload } = useAllowance(offset);
  const actions = useAllowanceActions(reload);

  const groups = useMemo(() => (summary ? groupEntriesByDay(summary.entries, new Date()) : []), [summary]);
  const close = () => setSheet(null);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: space.xl, paddingTop: insets.top + space.lg, paddingBottom: space.xxl * 2, gap: space.lg }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.serif, fontSize: 28, color: colors.text }}>Allowance</Text>
          {summary && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.lg }}>
              <Pressable onPress={() => setSheet({ kind: 'allowance' })} hitSlop={8}>
                <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.primary }}>Edit</Text>
              </Pressable>
              <Pressable
                onPress={() => setSheet({ kind: 'entry', initial: null })}
                accessibilityLabel="Add entry"
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={20} color={colors.onPrimary} />
              </Pressable>
            </View>
          )}
        </View>

        {loaded && !summary && <EmptyAllowance onSetUp={() => setSheet({ kind: 'allowance' })} />}

        {summary && (
          <>
            <PeriodNav
              label={periodLabel(summary.type, summary.period)}
              isCurrent={summary.isCurrent}
              onPrev={() => setOffset((o) => o - 1)}
              onNext={() => setOffset((o) => Math.min(0, o + 1))}
            />
            <BalanceCard summary={summary} />
            <StatGrid stats={amountStats(summary)} />
            {paceStats(summary).length > 0 && <StatGrid stats={paceStats(summary)} />}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: space.sm }}>
              <Text style={{ fontFamily: fonts.serif, fontSize: 20, color: colors.text }}>Activity</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>
                {summary.entries.length} {summary.entries.length === 1 ? 'entry' : 'entries'}
              </Text>
            </View>

            {groups.length === 0 ? (
              <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, textAlign: 'center', marginTop: space.lg }}>
                Nothing recorded {summary.isCurrent ? THIS_PERIOD[summary.type] : 'in this period'}. Tap + to add an expense.
              </Text>
            ) : (
              groups.map((group) => (
                <View key={group.key}>
                  <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                    {group.label}
                  </Text>
                  {group.entries.map((entry) => (
                    <EntryRow
                      key={entry.id}
                      entry={entry}
                      onPress={(e) => setSheet({ kind: 'entry', initial: e })}
                      onLongPress={actions.removeEntry}
                    />
                  ))}
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>

      {sheet?.kind === 'entry' && (
        <EntrySheet
          initial={sheet.initial}
          onClose={close}
          onSave={async (draft) => {
            await actions.saveEntry(sheet.initial, draft);
            close();
          }}
        />
      )}
      {sheet?.kind === 'allowance' && (
        <AllowanceSheet
          initial={summary && summary.allowance !== null ? { type: summary.type, amount: summary.allowance } : null}
          onClose={close}
          onSave={async (type, amount) => {
            await actions.saveAllowance(type, amount);
            setOffset(0);
            close();
          }}
        />
      )}
    </View>
  );
}