import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SubjectChips } from '@/components/SubjectChips';
import { fonts, space } from '@/constants/theme';
import { ComponentSheet } from '@/features/grades/components/ComponentSheet';
import { ItemSheet } from '@/features/grades/components/ItemSheet';
import { OverallPanel } from '@/features/grades/components/OverallPanel';
import { PeriodPanel } from '@/features/grades/components/PeriodPanel';
import { PeriodSheet } from '@/features/grades/components/PeriodSheet';
import { PeriodTabs, type PeriodTab } from '@/features/grades/components/PeriodTabs';
import { PresetSetup } from '@/features/grades/components/PresetSetup';
import { buildOverallView, buildPeriodView, summarizePeriods } from '@/features/grades/gradeView';
import { COMPONENT_PRESETS, PERIOD_PRESETS, presetsFromPeriods } from '@/features/grades/presets';
import type { GradeComponent, GradeItem, GradePeriod } from '@/features/grades/types';
import { useGradeActions } from '@/features/grades/useGradeActions';
import { useSubjectGrades } from '@/features/grades/useSubjectGrades';
import { useSubjectOptions } from '@/hooks/useSubjectOptions';
import { useTheme } from '@/theme';

type Sheet =
  | { kind: 'period'; initial: GradePeriod | null }
  | { kind: 'component'; period: GradePeriod; initial: GradeComponent | null }
  | { kind: 'item'; component: GradeComponent; initial: GradeItem | null };

const sumWeights = (list: { weight: number }[]) => list.reduce((sum, x) => sum + x.weight, 0);

export default function GradesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const subjects = useSubjectOptions();
  const { subjectId: subjectParam } = useLocalSearchParams<{ subjectId?: string }>();
  const [picked, setPicked] = useState<number | null>(subjectParam ? Number(subjectParam) : null);
  const [tabs, setTabs] = useState<Record<number, PeriodTab>>({});
  const [targets, setTargets] = useState<Record<string, string>>({});
  const [sheet, setSheet] = useState<Sheet | null>(null);

  const subjectId = picked ?? subjects[0]?.id ?? null;
  const { periods, scale, reload } = useSubjectGrades(subjectId);
  const actions = useGradeActions(reload);

  const tab = subjectId !== null ? (tabs[subjectId] ?? 'overall') : 'overall';
  const activePeriod = typeof tab === 'number' ? (periods.find((p) => p.id === tab) ?? null) : null;
  const targetKey = `${subjectId}:${activePeriod?.id ?? 'overall'}`;

  const view = useMemo(() => {
    if (!scale) return null;
    return activePeriod
      ? buildPeriodView(activePeriod, scale, targets[targetKey])
      : buildOverallView(periods, scale, targets[targetKey]);
  }, [scale, activePeriod, periods, targets, targetKey]);

  const selectTab = (next: PeriodTab) => subjectId !== null && setTabs((t) => ({ ...t, [subjectId]: next }));
  const selectTarget = (eq: string) => setTargets((t) => ({ ...t, [targetKey]: eq }));
  const close = () => setSheet(null);
  const openNewPeriod = () => setSheet({ kind: 'period', initial: null });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: space.xl, paddingTop: insets.top + space.lg, paddingBottom: space.xxl * 2, gap: space.lg }}
      >
        <Text style={{ fontFamily: fonts.serif, fontSize: 28, color: colors.text }}>Grades</Text>

        {subjects.length === 0 ? (
          <Text style={{ fontFamily: fonts.regular, color: colors.textMuted }}>
            Add a subject first.{' '}
            <Link href="/subjects" style={{ color: colors.primary }}>Open Subjects</Link>
          </Text>
        ) : (
          <SubjectChips subjects={subjects} selectedId={subjectId} onSelect={setPicked} />
        )}

        {scale && subjectId !== null && periods.length === 0 && (
          <PresetSetup
            title="How many grading periods?"
            subtitle="Most classes split the term, like Prelim, Midterm, Pre-finals and Finals. Each period gets its own grade, and together they make the final."
            presets={PERIOD_PRESETS}
            customLabel="Build my own"
            onPick={(preset) => actions.applyPeriodPreset(subjectId, preset)}
            onCustom={openNewPeriod}
          />
        )}

        {scale && view && subjectId !== null && periods.length > 0 && (
          <>
            <PeriodTabs periods={periods} selected={activePeriod?.id ?? 'overall'} onSelect={selectTab} onAdd={openNewPeriod} />

            {activePeriod ? (
              <PeriodPanel
                period={activePeriod}
                view={view}
                scale={scale}
                presets={[...presetsFromPeriods(periods, activePeriod.id), ...COMPONENT_PRESETS]}
                handlers={{
                  onPickPreset: (preset) => actions.applyComponentPreset(activePeriod.id, preset),
                  onNewComponent: () => setSheet({ kind: 'component', period: activePeriod, initial: null }),
                  onEditComponent: (c) => setSheet({ kind: 'component', period: activePeriod, initial: c }),
                  onRemoveComponent: actions.removeComponent,
                  onAddItem: (c) => setSheet({ kind: 'item', component: c, initial: null }),
                  onEditItem: (c, item) => setSheet({ kind: 'item', component: c, initial: item }),
                  onRemoveItem: actions.removeItem,
                  onSelectTarget: selectTarget,
                  onEditPeriod: () => setSheet({ kind: 'period', initial: activePeriod }),
                }}
              />
            ) : (
              <OverallPanel
                view={view}
                scale={scale}
                summaries={summarizePeriods(periods, scale)}
                onSelectTarget={selectTarget}
                onOpenPeriod={selectTab}
              />
            )}
          </>
        )}
      </ScrollView>

      {sheet?.kind === 'period' && subjectId !== null && (
        <PeriodSheet
          subjectId={subjectId}
          initial={sheet.initial}
          otherWeight={sumWeights(periods.filter((p) => p.id !== sheet.initial?.id))}
          onClose={close}
          onSave={async (draft) => {
            await actions.savePeriod(sheet.initial, draft);
            close();
          }}
          onDelete={(period) => {
            close();
            actions.removePeriod(period);
          }}
        />
      )}
      {sheet?.kind === 'component' && (
        <ComponentSheet
          periodId={sheet.period.id}
          initial={sheet.initial}
          otherWeight={sumWeights(sheet.period.components.filter((c) => c.id !== sheet.initial?.id))}
          onClose={close}
          onSave={async (draft) => {
            await actions.saveComponent(sheet.initial, draft);
            close();
          }}
        />
      )}
      {sheet?.kind === 'item' && (
        <ItemSheet
          component={sheet.component}
          initial={sheet.initial}
          onClose={close}
          onSave={async (draft) => {
            await actions.saveItem(sheet.initial, draft);
            close();
          }}
        />
      )}
    </View>
  );
}