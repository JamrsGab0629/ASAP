import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SubjectChips } from '@/components/SubjectChips';
import { fonts, radius, space } from '@/constants/theme';
import { ComponentCard } from '@/features/grades/components/ComponentCard';
import { ComponentSetup } from '@/features/grades/components/ComponentSetup';
import { ComponentSheet } from '@/features/grades/components/ComponentSheet';
import { ItemSheet } from '@/features/grades/components/ItemSheet';
import { NeededScoreCard } from '@/features/grades/components/NeededScoreCard';
import { StandingCard } from '@/features/grades/components/StandingCard';
import { buildGradeView } from '@/features/grades/gradeView';
import type { GradeComponent, GradeItem } from '@/features/grades/types';
import { useGradeActions } from '@/features/grades/useGradeActions';
import { useSubjectGrades } from '@/features/grades/useSubjectGrades';
import { useSubjectOptions } from '@/hooks/useSubjectOptions';
import { useTheme } from '@/theme';

type Sheet =
  | { kind: 'component'; initial: GradeComponent | null }
  | { kind: 'item'; component: GradeComponent; initial: GradeItem | null };

export default function GradesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const subjects = useSubjectOptions();
  const { subjectId: subjectParam } = useLocalSearchParams<{ subjectId?: string }>();
  const [picked, setPicked] = useState<number | null>(subjectParam ? Number(subjectParam) : null);
  const [targets, setTargets] = useState<Record<number, string>>({});
  const [sheet, setSheet] = useState<Sheet | null>(null);

  const subjectId = picked ?? subjects[0]?.id ?? null;
  const { components, scale, reload } = useSubjectGrades(subjectId);
  const actions = useGradeActions(reload);

  const view = useMemo(
    () => (scale && subjectId !== null ? buildGradeView(components, scale, targets[subjectId]) : null),
    [components, scale, targets, subjectId],
  );

  const close = () => setSheet(null);
  const openNewComponent = () => setSheet({ kind: 'component', initial: null });

  const header = (
    <View style={{ gap: space.lg, marginBottom: space.sm }}>
      <Text style={{ fontFamily: fonts.serif, fontSize: 28, color: colors.text }}>Grades</Text>

      {subjects.length === 0 ? (
        <Text style={{ fontFamily: fonts.regular, color: colors.textMuted }}>
          Add a subject first.{' '}
          <Link href="/subjects" style={{ color: colors.primary }}>Open Subjects</Link>
        </Text>
      ) : (
        <SubjectChips subjects={subjects} selectedId={subjectId} onSelect={setPicked} />
      )}

      {scale && subjectId !== null && components.length === 0 && (
        <ComponentSetup onPickPreset={(p) => actions.applyPreset(subjectId, p)} onCustom={openNewComponent} />
      )}

      {view && scale && components.length > 0 && (
        <>
          <StandingCard view={view} scale={scale} />
          <NeededScoreCard
            view={view}
            onSelectTarget={(eq) => subjectId !== null && setTargets((t) => ({ ...t, [subjectId]: eq }))}
          />
          {Math.abs(view.totalWeight - 100) > 0.001 && (
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.warning }}>
              Your parts add up to {view.totalWeight}%, not 100%. Tap a part to fix its weight.
            </Text>
          )}
        </>
      )}
    </View>
  );

  const footer =
    components.length > 0 ? (
      <Pressable
        onPress={openNewComponent}
        style={{ padding: space.lg, borderRadius: radius.lg, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, alignItems: 'center' }}
      >
        <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.primary }}>+ Add part of the grade</Text>
      </Pressable>
    ) : null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={components}
        keyExtractor={(c) => String(c.id)}
        contentContainerStyle={{ padding: space.xl, paddingTop: insets.top + space.lg, gap: space.md }}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        renderItem={({ item }) => (
          <ComponentCard
            component={item}
            onEdit={(c) => setSheet({ kind: 'component', initial: c })}
            onLongPress={actions.removeComponent}
            onAddItem={(c) => setSheet({ kind: 'item', component: c, initial: null })}
            onEditItem={(c, i) => setSheet({ kind: 'item', component: c, initial: i })}
            onLongPressItem={actions.removeItem}
          />
        )}
      />

      {sheet?.kind === 'component' && subjectId !== null && (
        <ComponentSheet
          subjectId={subjectId}
          initial={sheet.initial}
          otherWeight={components.filter((c) => c.id !== sheet.initial?.id).reduce((sum, c) => sum + c.weight, 0)}
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