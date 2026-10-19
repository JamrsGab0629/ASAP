import { Text, View } from 'react-native';
import { fonts } from '@/constants/theme';
import { useTheme } from '@/theme';

type Props = { dateLabel: string; headline: string };

export function DashboardHeader({ dateLabel, headline }: Props) {
  const { colors } = useTheme();
  const eyebrow = {
    fontFamily: fonts.regular,
    fontSize: 12,
    letterSpacing: 0.8,
    color: colors.textMuted,
  } as const;

  return (
    <View style={{ alignItems: 'center', gap: 6 }}>
      <Text style={eyebrow}>{dateLabel.toUpperCase()}</Text>
      <Text style={eyebrow}>TODAY I WILL…</Text>
      <Text style={{ fontFamily: fonts.serif, fontSize: 28, lineHeight: 33, color: colors.text, textAlign: 'center' }}>
        {headline}
      </Text>
    </View>
  );
}