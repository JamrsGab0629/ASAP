import { useState } from 'react';
import { Alert } from 'react-native';
import type { ComponentDraft, GradeComponent } from '../types';
import { parseComponent } from '../validateGrade';
import { FormField } from './FormField';
import { FormSheet } from './FormSheet';

type Props = {
  subjectId: number;
  initial: GradeComponent | null;
  otherWeight: number; // weight used by the subject's other parts
  onClose: () => void;
  onSave: (draft: ComponentDraft) => void;
};

export function ComponentSheet({ subjectId, initial, otherWeight, onClose, onSave }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [weight, setWeight] = useState(initial ? String(initial.weight) : '');

  const submit = () => {
    const result = parseComponent(subjectId, { name, weight }, otherWeight);
    if ('error' in result) return Alert.alert('Check the form', result.error);
    onSave(result.draft);
  };

  return (
    <FormSheet title={initial ? 'Edit part' : 'Add part of the grade'} onClose={onClose} onSave={submit}>
      <FormField label="Name" value={name} onChangeText={setName} placeholder="e.g. Quizzes" />
      <FormField
        label={`Weight (% of the final grade, ${Math.max(0, 100 - otherWeight)}% still free)`}
        value={weight} onChangeText={setWeight} placeholder="e.g. 20" keyboardType="decimal-pad"
      />
    </FormSheet>
  );
}