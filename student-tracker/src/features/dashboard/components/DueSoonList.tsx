import { ScrollView, Text } from 'react-native';
import { fonts, space } from '@/constants/theme';
import type { DueDeadline } from '@/features/deadlines/upcomingDeadlines';
import { useTheme } from '@/theme';
import { DeadlineCard } from './DeadlineCard';

type Props = { deadlines: DueDeadline[] };

export function DueSoonList({ deadlines }: Props) {
  const { colors } = useTheme();

  if (deadlines.length === 0) {
    return (
      <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted }}>
        Nothing due. Enjoy the break.
      </Text>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -space.xl }}
      contentContainerStyle={{ gap: 12, paddingHorizontal: space.xl }}
    >
      {deadlines.map((d) => (
        <DeadlineCard key={d.id} deadline={d} />
      ))}
    </ScrollView>
  );
}