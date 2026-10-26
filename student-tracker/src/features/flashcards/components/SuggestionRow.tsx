import { Check, Pencil } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { Suggestion, SuggestionKind } from '../suggest/types';

const KIND_LABEL: Record<SuggestionKind, string> = {
  term: 'Term',
  definition: 'Definition',
  list: 'List',
  highlight: 'From your highlight',
  blank: 'Fill in the blank',
};

type Props = { suggestion: Suggestion; picked: boolean; onToggle: () => void; onEdit: () => void };

export function SuggestionRow({ suggestion, picked, onToggle, onEdit }: Props) {
  const { colors } = useTheme();
   const label = suggestion.rewritten
    ? 'Question (AI)'
    : suggestion.highlighted && suggestion.kind !== 'highlight'
      ? `${KIND_LABEL[suggestion.kind]} · highlighted`
      : KIND_LABEL[suggestion.kind];

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: picked }}
      style={{
        flexDirection: 'row', gap: space.md, padding: space.lg, borderRadius: radius.lg, borderWidth: 1,
        borderColor: picked ? colors.primary : colors.border, backgroundColor: colors.surface, opacity: picked ? 1 : 0.7,
      }}
    >
      <View
        style={{
          width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, marginTop: 2, alignItems: 'center', justifyContent: 'center',
          borderColor: picked ? colors.primary : colors.border, backgroundColor: picked ? colors.primary : 'transparent',
        }}
      >
        {picked && <Check size={14} color={colors.onPrimary} />}
      </View>

      <View style={{ flex: 1, gap: space.xs }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.primary }}>{label}</Text>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.text }}>{suggestion.front}</Text>
        <Text numberOfLines={4} style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted }}>{suggestion.back}</Text>
      </View>

      <Pressable onPress={onEdit} hitSlop={12} accessibilityLabel="Edit this card" style={{ alignSelf: 'flex-start' }}>
        <Pencil size={18} color={colors.textMuted} />
      </Pressable>
    </Pressable>
  );
}