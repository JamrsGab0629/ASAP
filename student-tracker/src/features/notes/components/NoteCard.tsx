import { Star } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import { notePreview, noteTitle, relativeDay } from '../noteText';
import type { NoteListItem } from '../types';

type Props = {
  note: NoteListItem;
  today: Date;
  onPress: (note: NoteListItem) => void;
  onToggleReview: (note: NoteListItem) => void;
};

export function NoteCard({ note, today, onPress, onToggleReview }: Props) {
  const { colors } = useTheme();
  const preview = notePreview(note);
  const tags = note.tags ? note.tags.split(',').map((t) => `#${t}`).join(' ') : '';

  return (
    <Pressable
      onPress={() => onPress(note)}
      style={{
        padding: space.lg, gap: space.xs, backgroundColor: colors.surface, borderRadius: radius.lg,
        borderWidth: 1, borderColor: colors.border,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, flexShrink: 1 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: note.subjectColor }} />
          <Text numberOfLines={1} style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, flexShrink: 1 }}>
            {note.subjectName} · {relativeDay(note.updatedAt, today)}
          </Text>
        </View>
        <Pressable hitSlop={10} onPress={() => onToggleReview(note)} accessibilityLabel="Mark for review">
          <Star size={18} color={note.reviewFlag ? colors.primary : colors.textMuted} fill={note.reviewFlag ? colors.primary : 'transparent'} />
        </Pressable>
      </View>
      <Text numberOfLines={1} style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.text }}>{noteTitle(note)}</Text>
      {preview ? (
        <Text numberOfLines={2} style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted }}>{preview}</Text>
      ) : null}
      {tags ? <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.primary }}>{tags}</Text> : null}
    </Pressable>
  );
}