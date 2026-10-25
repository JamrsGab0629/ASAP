import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts, radius, space } from '@/constants/theme';
import { RatingButtons } from '@/features/flashcards/components/RatingButtons';
import { SessionSummary } from '@/features/flashcards/components/SessionSummary';
import { StudyCard } from '@/features/flashcards/components/StudyCard';
import { useReviewSession } from '@/features/flashcards/useReviewSession';
import { useTheme } from '@/theme';

export default function ReviewScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { subjectId: param } = useLocalSearchParams<{ subjectId?: string }>();
  const session = useReviewSession(param ? Number(param) : null);

  const header = (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: space.xl, paddingTop: insets.top + space.lg }}>
      <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Close">
        <X size={24} color={colors.text} />
      </Pressable>
      {session.status === 'studying' && (
        <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.textMuted }}>{session.remaining} left</Text>
      )}
    </View>
  );

  let body;
  if (session.status === 'loading') {
    body = <ActivityIndicator color={colors.primary} style={{ marginTop: space.xxl }} />;
  } else if (session.status === 'empty') {
    body = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.md, padding: space.xl }}>
        <Text style={{ fontFamily: fonts.serif, fontSize: 26, color: colors.text }}>All caught up</Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted, textAlign: 'center' }}>
          Nothing is due right now. Come back later, or add more cards.
        </Text>
      </View>
    );
  } else if (session.status === 'finished') {
    body = <SessionSummary reviewed={session.reviewed} tally={session.tally} onDone={() => router.back()} />;
  } else if (session.card && session.labels) {
    body = (
      <View style={{ flex: 1, gap: space.lg, padding: space.xl, paddingTop: 0, paddingBottom: insets.bottom + space.xl }}>
        <StudyCard front={session.card.front} back={session.card.back} revealed={session.revealed} onReveal={session.reveal} />
        {session.revealed ? (
          <RatingButtons labels={session.labels} onRate={session.rate} />
        ) : (
          <Pressable onPress={session.reveal} style={{ padding: space.lg, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center' }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.onPrimary }}>Show answer</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {header}
      {body}
    </View>
  );
}