import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Pressable, Text } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';

type Props = {
  label: string;
  mode: 'time' | 'date';
  value: Date;
  display: (d: Date) => string;
  onChange: (d: Date) => void;
};

export function PickerField({ label, mode, value, display, onChange }: Props) {
  const { colors } = useTheme();

  const open = () =>
    DateTimePickerAndroid.open({
      value,
      mode,
      is24Hour: false,
      onChange: (event, picked) => {
        if (event.type === 'set' && picked) onChange(picked);
      },
    });

  return (
    <Pressable
      onPress={open}
      style={{
        flex: 1,
        padding: space.md,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted }}>{label}</Text>
      <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.text }}>{display(value)}</Text>
    </Pressable>
  );
}