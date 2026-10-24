import { Highlighter } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { LengthSelector } from '@/features/shorten/components/LengthSelector';
import { ShortenedView } from '@/features/shorten/components/ShortenedView';
import { LENGTH_LEVELS } from '@/features/shorten/levels';
import { shorten } from '@/features/shorten/shorten';
import { useTheme } from '@/theme';
import type { Highlight } from '../types';
import { useHighlights } from '../useHighlights';
import { HighlightedText } from './HighlightedText';
import { HighlightListSheet } from './HighlightListSheet';

type Props = { noteId: number; body: string };

export function NoteReadView({ noteId, body }: Props) {
  const { colors } = useTheme();
  const { highlights, add, remove } = useHighlights(noteId);
  const [listOpen, setListOpen] = useState(false);
  const [levelKey, setLevelKey] = useState(LENGTH_LEVELS[0].key);

  const level = LENGTH_LEVELS.find((l) => l.key === levelKey) ?? LENGTH_LEVELS[0];
  const result = useMemo(() => shorten(body, level.ratio), [body, level.ratio]);

  const confirmRemove = (highlight: Highlight) =>
    Alert.alert('Remove highlight?', highlight.text.length > 80 ? `${highlight.text.slice(0, 80)}…` : highlight.text, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => remove(highlight.id) },
    ]);

  const renderText = (text: string) => (
    <HighlightedText body={text} highlights={highlights} onHighlight={add} onPressHighlight={confirmRemove} />
  );

  if (body.trim() === '') {
    return (
      <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, textAlign: 'center', marginTop: space.xl }}>
        Nothing to read yet. Switch to Write to add some text.
      </Text>
    );
  }

  const status =
    level.ratio >= 1
      ? null
      : result.shortened
        ? `Showing ${result.keptWords} of ${result.totalWords} words. Tap a dashed bar to see what's hidden.`
        : 'This note is already short.';

  return (
    <View style={{ gap: space.lg }}>
      <LengthSelector levels={LENGTH_LEVELS} selected={level.key} onSelect={setLevelKey} />
      {status && <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>{status}</Text>}

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.md }}>
        <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>
          {highlights.length === 0 ? 'Tap a sentence to highlight it.' : 'Tap a highlight to remove it.'}
        </Text>
        <Pressable
          onPress={() => setListOpen(true)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.sm, paddingHorizontal: space.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border }}
        >
          <Highlighter size={14} color={colors.primary} />
          <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.text }}>{highlights.length}</Text>
        </Pressable>
      </View>

      {level.ratio >= 1 ? (
        renderText(body)
      ) : (
        <ShortenedView key={level.key} blocks={result.blocks} renderKept={renderText} />
      )}

      {listOpen && <HighlightListSheet highlights={highlights} onRemove={remove} onClose={() => setListOpen(false)} />}
    </View>
  );
}