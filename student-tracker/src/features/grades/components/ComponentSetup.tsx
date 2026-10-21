import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import { COMPONENT_PRESETS, describePreset, type ComponentPreset } from '../presets';

type Props = { onPickPreset: (preset: ComponentPreset) => void; onCustom: () => void };

/** Shown for a subject that has no grading parts yet. */
export function ComponentSetup({ onPickPreset, onCustom }: Props) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: space.md }}>
      <Text style={{ fontFamily: fonts.serif, fontSize: 20, color: colors.text }}>How is this subject graded?</Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted }}>
        Pick a common setup. You can rename parts and change their weights afterwards.
      </Text>
      {COMPONENT_PRESETS.map((preset) => (
        <Pressable
          key={preset.id}
          onPress={() => onPickPreset(preset)}
          style={{ padding: space.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, gap: 2 }}
        >
          <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.text }}>{preset.label}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>{describePreset(preset)}</Text>
        </Pressable>
      ))}
      <Pressable onPress={onCustom} style={{ padding: space.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.primary, alignItems: 'center' }}>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.primary }}>Build my own</Text>
      </Pressable>
    </View>
  );
}