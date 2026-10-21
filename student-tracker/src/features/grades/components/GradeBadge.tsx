import { Pressable, Text } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';

type Props = { percent: number | undefined; onPress: () => void };

export function GradeBadge({ percent, onPress }: Props) {
  const { colors } = useTheme();
  const scored = percent !== undefined;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      accessibilityLabel="Open grades"
      style={{
        paddingHorizontal: space.md, paddingVertical: space.xs + 2, borderRadius: radius.pill,
        borderWidth: 1, borderColor: scored ? colors.primary : colors.border,
        backgroundColor: scored ? colors.tint : 'transparent',
      }}
    >
      <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: scored ? colors.primary : colors.textMuted }}>
        {scored ? `${percent.toFixed(0)}%` : 'Grades'}
      </Text>
    </Pressable>
  );
}