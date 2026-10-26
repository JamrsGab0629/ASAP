import { Switch, Text, View } from 'react-native';
import { fonts, space } from '@/constants/theme';
import { useTheme } from '@/theme';

type Props = { value: boolean; onChange: (on: boolean) => void };

/** Turns on automatic AI question writing for scans. The choice is remembered. */
export function AiScanSwitch({ value, onChange }: Props) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: colors.text }}>Use AI to write questions</Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>
          Turns fill-in-the-blank cards into questions after each scan. Slower. Works offline once the model is downloaded.
        </Text>
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.primary, false: colors.border }} />
    </View>
  );
}