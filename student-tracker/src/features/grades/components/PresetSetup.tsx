import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import { describePreset, type Preset } from '../presets';

type Props = {
  title: string;
  subtitle: string;
  presets: Preset[];
  customLabel: string;
  onPick: (preset: Preset) => void;
  onCustom: () => void;
};

/** "Pick a ready-made setup or build your own." Used for periods and for grading parts. */
export function PresetSetup({ title, subtitle, presets, customLabel, onPick, onCustom }: Props) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: space.md }}>
      <Text style={{ fontFamily: fonts.serif, fontSize: 20, color: colors.text }}>{title}</Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted }}>{subtitle}</Text>
      {presets.map((preset) => (
        <Pressable
          key={preset.id}
          onPress={() => onPick(preset)}
          style={{ padding: space.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, gap: 2 }}
        >
          <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.text }}>{preset.label}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>{describePreset(preset)}</Text>
        </Pressable>
      ))}
      <Pressable onPress={onCustom} style={{ padding: space.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.primary, alignItems: 'center' }}>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.primary }}>{customLabel}</Text>
      </Pressable>
    </View>
  );
}