import { Text, View } from 'react-native';
import { Clock } from 'lucide-react-native';
import { fonts, radius } from '@/constants/theme';
import type { NextClass } from '@/features/schedule/nextClass';
import { formatTime } from '@/lib/dates';
import { formatCountdown } from '@/lib/format';
import { useTheme } from '@/theme';

type Props = { next: NextClass | null };

function tagFor(next: NextClass): string | null {
  if (next.item.isMakeup) return 'Makeup class';
  if (next.item.isMoved) return 'Moved';
  return null;
}

export function NextClassCard({ next }: Props) {
  const { colors } = useTheme();

  if (!next) {
    return (
      <View style={{ backgroundColor: colors.tint, borderRadius: radius.lg, padding: 18, gap: 4 }}>
        <Text style={{ fontFamily: fonts.serif, fontSize: 18, color: colors.text }}>No more classes today</Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted }}>
          Good time to review your notes.
        </Text>
      </View>
    );
  }

  const { item, status, minutesUntil } = next;
  const tag = tagFor(next);
  const details = [item.room, item.teacher].filter(Boolean).join(' · ');

  return (
    <View style={{ backgroundColor: colors.hero, borderRadius: radius.lg, padding: 18, gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Clock size={14} color={colors.onHeroMuted} />
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, letterSpacing: 0.5, color: colors.onHeroMuted }}>
            {status === 'ongoing' ? 'HAPPENING NOW' : `NEXT CLASS · ${formatCountdown(minutesUntil).toUpperCase()}`}
          </Text>
        </View>
        {tag ? (
          <View style={{ backgroundColor: colors.onHero, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: colors.hero }}>{tag}</Text>
          </View>
        ) : null}
      </View>

      <Text style={{ fontFamily: fonts.serif, fontSize: 24, color: colors.onHero }}>{item.subjectName}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: colors.onHero }}>{formatTime(item.start)}</Text>
        {details ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.onHeroMuted }}>{details}</Text>
        ) : null}
      </View>
    </View>
  );
}