import { useState } from 'react';
import { Alert } from 'react-native';
import type { ComponentDraft, GradeComponent } from '../types';
import { parseComponent } from '../validateGrade';
import { FormField } from '../../../components/FormField';
import { FormSheet } from '../../../components/FormSheet';

type Props = {
  periodId: number;
  initial: GradeComponent | null;
  otherWeight: number; // weight used by the period's other parts
  onClose: () => void;
  onSave: (draft: ComponentDraft) => void;
};

export function ComponentSheet({ periodId, initial, otherWeight, onClose, onSave }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [weight, setWeight] = useState(initial ? String(initial.weight) : '');

  const submit = () => {
    const result = parseComponent(periodId, { name, weight }, otherWeight);
    if ('error' in result) return Alert.alert('Check the form', result.error);
    onSave(result.draft);
  };

  return (
    <FormSheet title={initial ? 'Edit part' : 'Add part of the grade'} onClose={onClose} onSave={submit}>
      <FormField label="Name" value={name} onChangeText={setName} placeholder="e.g. Quizzes" />
      <FormField
        label={`Weight (% of this period, ${Math.max(0, 100 - otherWeight)}% still free)`}
        value={weight} onChangeText={setWeight} placeholder="e.g. 20" keyboardType="decimal-pad"
      />
    </FormSheet>
  );
}