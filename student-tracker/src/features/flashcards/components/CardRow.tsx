import { Pressable, Text } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import { cardStatus } from '../cardStatus';
import type { Card } from '../types';

type Props = { card: Card; now: Date; onPress: () => void };

export function CardRow({ card, now, onPress }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{ padding: space.lg, gap: space.xs, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}
    >
      <Text numberOfLines={2} style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.text }}>{card.front}</Text>
      <Text numberOfLines={2} style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted }}>{card.back}</Text>
      <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.primary }}>{cardStatus(card, now)}</Text>
    </Pressable>
  );
}