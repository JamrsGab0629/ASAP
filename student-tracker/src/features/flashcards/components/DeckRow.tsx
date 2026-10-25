import { ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import { deckStudyCount } from '../deckTotals';
import type { DeckSummary } from '../types';

type Props = { deck: DeckSummary; newLeft: number; onOpen: () => void; onStudy: () => void };

export function DeckRow({ deck, newLeft, onOpen, onStudy }: Props) {
  const { colors } = useTheme();
  const studyCount = deckStudyCount(deck, newLeft);
  const newCount = Math.min(deck.fresh, newLeft);

  return (
    <Pressable
      onPress={onOpen}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg,
        borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
      }}
    >
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: deck.color }} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text numberOfLines={1} style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.text }}>{deck.name}</Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>
          {deck.total === 0 ? 'No cards yet' : `${deck.due} due · ${newCount} new · ${deck.total} cards`}
        </Text>
      </View>
      {studyCount > 0 ? (
        <Pressable
          onPress={onStudy}
          hitSlop={6}
          style={{ paddingVertical: space.sm, paddingHorizontal: space.lg, borderRadius: radius.pill, backgroundColor: colors.primary }}
        >
          <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.onPrimary }}>Study {studyCount}</Text>
        </Pressable>
      ) : (
        <ChevronRight size={20} color={colors.textMuted} />
      )}
    </Pressable>
  );
}