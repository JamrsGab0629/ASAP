import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';

export function FormField({ label, ...input }: { label: string } & TextInputProps) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: space.sm, marginTop: space.lg }}>
      <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted }}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        {...input}
        style={{
          fontFamily: fonts.regular, fontSize: 16, color: colors.text, padding: space.md,
          borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
        }}
      />
    </View>
  );
}