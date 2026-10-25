import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { FormSheet } from '@/components/FormSheet';
import { SubjectChips } from '@/components/SubjectChips';
import { fonts, radius, space } from '@/constants/theme';
import type { SubjectOption } from '@/lib/subjectOptions';
import { useTheme } from '@/theme';
import type { Card, CardDraft } from '../types';
import { checkCard } from '../validateCard';

type Props = {
  card: Card | null; // null = a new card
  initialSubjectId: number | null;
  subjects: SubjectOption[];
  onClose: () => void;
  onSave: (draft: CardDraft) => void;
  onDelete: () => void;
};

export function CardSheet({ card, initialSubjectId, subjects, onClose, onSave, onDelete }: Props) {
  const { colors } = useTheme();
  const [subjectId, setSubjectId] = useState(initialSubjectId);
  const [front, setFront] = useState(card?.front ?? '');
  const [back, setBack] = useState(card?.back ?? '');
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    const check = checkCard(subjectId, front, back);
    if (!check.ok) return setError(check.message);
    onSave(check.draft);
  };

  const confirmDelete = () =>
    Alert.alert('Delete this card?', 'Its study history is removed too.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);

  const input = {
    fontFamily: fonts.regular, fontSize: 16, color: colors.text, minHeight: 110, padding: space.lg,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
  } as const;

  return (
    <FormSheet title={card ? 'Edit card' : 'New card'} onClose={onClose} onSave={save}>
      <View style={{ gap: space.lg, marginTop: space.lg }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted }}>Subject</Text>
        <SubjectChips subjects={subjects} selectedId={subjectId} onSelect={setSubjectId} />

        <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted }}>Front (question or term)</Text>
        <TextInput value={front} onChangeText={setFront} multiline textAlignVertical="top" placeholder="What is an algorithm?" placeholderTextColor={colors.textMuted} style={input} />

        <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted }}>Back (answer)</Text>
        <TextInput value={back} onChangeText={setBack} multiline textAlignVertical="top" placeholder="A finite sequence of steps that solves a problem." placeholderTextColor={colors.textMuted} style={input} />

        {error && <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.danger }}>{error}</Text>}

        {card && (
          <Pressable onPress={confirmDelete} style={{ alignItems: 'center', padding: space.md }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.danger }}>Delete card</Text>
          </Pressable>
        )}
      </View>
    </FormSheet>
  );
}