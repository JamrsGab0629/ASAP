import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import { RATINGS } from '../ratings';
import type { Rating } from '../types';

type Props = { reviewed: number; tally: Record<Rating, number>; onDone: () => void };

export function SessionSummary({ reviewed, tally, onDone }: Props) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: space.xl, padding: space.xl }}>
      <Text style={{ fontFamily: fonts.serif, fontSize: 30, color: colors.text }}>Session complete</Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.textMuted }}>
        {reviewed} answer{reviewed === 1 ? '' : 's'} today
      </Text>
      <View style={{ flexDirection: 'row', gap: space.lg }}>
        {RATINGS.map(({ rating, label }) => (
          <View key={rating} style={{ alignItems: 'center' }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 22, color: colors.text }}>{tally[rating]}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted }}>{label}</Text>
          </View>
        ))}
      </View>
      <Pressable onPress={onDone} style={{ alignSelf: 'stretch', padding: space.lg, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center' }}>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.onPrimary }}>Done</Text>
      </Pressable>
    </View>
  );
}