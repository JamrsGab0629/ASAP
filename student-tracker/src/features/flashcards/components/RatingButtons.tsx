import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import { RATINGS } from '../ratings';
import type { Rating } from '../types';

type Props = { labels: Record<Rating, string>; onRate: (rating: Rating) => void };

export function RatingButtons({ labels, onRate }: Props) {
  const { colors } = useTheme();
  const tone: Record<Rating, string> = { 1: colors.danger, 2: colors.warning, 3: colors.primary, 4: colors.primary };

  return (
    <View style={{ flexDirection: 'row', gap: space.sm }}>
      {RATINGS.map(({ rating, label }) => (
        <Pressable
          key={rating}
          onPress={() => onRate(rating)}
          accessibilityLabel={`${label}, next in ${labels[rating]}`}
          style={{
            flex: 1, alignItems: 'center', gap: 2, paddingVertical: space.md, borderRadius: radius.md,
            borderWidth: 1, borderColor: tone[rating], backgroundColor: colors.surface,
          }}
        >
          <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: tone[rating] }}>{label}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted }}>{labels[rating]}</Text>
        </Pressable>
      ))}
    </View>
  );
}