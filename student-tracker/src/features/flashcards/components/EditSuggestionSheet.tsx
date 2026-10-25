import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { FormSheet } from '@/components/FormSheet';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { Suggestion } from '../suggest/types';

type Props = {
  suggestion: Suggestion;
  onClose: () => void;
  onSave: (change: { front: string; back: string }) => void;
};

export function EditSuggestionSheet({ suggestion, onClose, onSave }: Props) {
  const { colors } = useTheme();
  const [front, setFront] = useState(suggestion.front);
  const [back, setBack] = useState(suggestion.back);

  const input = {
    fontFamily: fonts.regular, fontSize: 16, color: colors.text, minHeight: 110, padding: space.lg,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
  } as const;
  const label = { fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted } as const;

  return (
    <FormSheet title="Edit suggestion" onClose={onClose} onSave={() => onSave({ front: front.trim(), back: back.trim() })} saveDisabled={!front.trim() || !back.trim()}>
      <View style={{ gap: space.lg, marginTop: space.lg }}>
        <View style={{ gap: space.xs }}>
          <Text style={label}>Front</Text>
          <TextInput value={front} onChangeText={setFront} multiline textAlignVertical="top" style={input} />
        </View>
        <View style={{ gap: space.xs }}>
          <Text style={label}>Back</Text>
          <TextInput value={back} onChangeText={setBack} multiline textAlignVertical="top" style={input} />
        </View>
      </View>
    </FormSheet>
  );
}