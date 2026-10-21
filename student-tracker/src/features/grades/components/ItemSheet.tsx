import { useState } from 'react';
import { Alert, View } from 'react-native';
import { space } from '@/constants/theme';
import type { GradeComponent, GradeItem, ItemDraft } from '../types';
import { parseItem } from '../validateGrade';
import { FormField } from './FormField';
import { FormSheet } from './FormSheet';

type Props = {
  component: GradeComponent;
  initial: GradeItem | null;
  onClose: () => void;
  onSave: (draft: ItemDraft) => void;
};

export function ItemSheet({ component, initial, onClose, onSave }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [score, setScore] = useState(initial?.score != null ? String(initial.score) : '');
  const [maxScore, setMaxScore] = useState(initial ? String(initial.maxScore) : '100');

  const submit = () => {
    const result = parseItem(component.id, { title, score, maxScore });
    if ('error' in result) return Alert.alert('Check the form', result.error);
    onSave(result.draft);
  };

  return (
    <FormSheet title={initial ? `Edit ${component.name} item` : `Add to ${component.name}`} onClose={onClose} onSave={submit}>
      <FormField label="Title" value={title} onChangeText={setTitle} placeholder="e.g. Quiz 1" />
      <View style={{ flexDirection: 'row', gap: space.md }}>
        <View style={{ flex: 1 }}>
          <FormField label="Your score" value={score} onChangeText={setScore} placeholder="Empty if not yet" keyboardType="decimal-pad" />
        </View>
        <View style={{ flex: 1 }}>
          <FormField label="Out of" value={maxScore} onChangeText={setMaxScore} keyboardType="decimal-pad" />
        </View>
      </View>
    </FormSheet>
  );
}