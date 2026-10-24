import { Highlighter } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
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

  const confirmRemove = (highlight: Highlight) =>
    Alert.alert('Remove highlight?', highlight.text.length > 80 ? `${highlight.text.slice(0, 80)}…` : highlight.text, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => remove(highlight.id) },
    ]);

  if (body.trim() === '') {
    return (
      <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, textAlign: 'center', marginTop: space.xl }}>
        Nothing to read yet. Switch to Write to add some text.
      </Text>
    );
  }

  return (
    <View style={{ gap: space.lg }}>
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

      <HighlightedText body={body} highlights={highlights} onHighlight={add} onPressHighlight={confirmRemove} />

      {listOpen && <HighlightListSheet highlights={highlights} onRemove={remove} onClose={() => setListOpen(false)} />}
    </View>
  );
}