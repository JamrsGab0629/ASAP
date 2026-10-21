import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { GradeView } from '../gradeView';
import type { Preset } from '../presets';
import type { GradeComponent, GradeItem, GradePeriod, GradeScale } from '../types';
import { ComponentCard } from './ComponentCard';
import { NeededScoreCard } from './NeededScoreCard';
import { PresetSetup } from './PresetSetup';
import { StandingCard } from './StandingCard';

export type PeriodPanelHandlers = {
  onPickPreset: (preset: Preset) => void;
  onNewComponent: () => void;
  onEditComponent: (c: GradeComponent) => void;
  onRemoveComponent: (c: GradeComponent) => void;
  onAddItem: (c: GradeComponent) => void;
  onEditItem: (c: GradeComponent, item: GradeItem) => void;
  onRemoveItem: (item: GradeItem) => void;
  onSelectTarget: (equivalent: string) => void;
  onEditPeriod: () => void;
};

type Props = {
  period: GradePeriod;
  view: GradeView;
  scale: GradeScale;
  presets: Preset[];
  handlers: PeriodPanelHandlers;
};

/** One grading period: set up its parts, add items, see the period grade. */
export function PeriodPanel({ period, view, scale, presets, handlers }: Props) {
  const { colors } = useTheme();

  return (
    <View style={{ gap: space.lg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted }}>
          {period.name} is {period.weight}% of the final grade
        </Text>
        <Pressable onPress={handlers.onEditPeriod} hitSlop={8}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.primary }}>Edit</Text>
        </Pressable>
      </View>

      {period.components.length === 0 ? (
        <PresetSetup
          title={`How is ${period.name} graded?`}
          subtitle="Pick a setup, or copy one from another period. You can change it afterwards."
          presets={presets}
          customLabel="Build my own"
          onPick={handlers.onPickPreset}
          onCustom={handlers.onNewComponent}
        />
      ) : (
        <>
          <StandingCard view={view} scale={scale} title={`${period.name} grade`} />
          <NeededScoreCard view={view} onSelectTarget={handlers.onSelectTarget} />
          {Math.abs(view.totalWeight - 100) > 0.001 && (
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.warning }}>
              Your parts add up to {view.totalWeight}%, not 100%. Tap a part to fix its weight.
            </Text>
          )}
          {period.components.map((c) => (
            <ComponentCard
              key={c.id}
              component={c}
              onEdit={handlers.onEditComponent}
              onLongPress={handlers.onRemoveComponent}
              onAddItem={handlers.onAddItem}
              onEditItem={handlers.onEditItem}
              onLongPressItem={handlers.onRemoveItem}
            />
          ))}
          <Pressable
            onPress={handlers.onNewComponent}
            style={{ padding: space.lg, borderRadius: radius.lg, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, alignItems: 'center' }}
          >
            <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.primary }}>+ Add part of the grade</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}