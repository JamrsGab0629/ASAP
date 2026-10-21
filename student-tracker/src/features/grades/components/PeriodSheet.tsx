import { useState } from 'react';
import { Alert, Pressable, Text } from 'react-native';
import { fonts, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { GradePeriod, PeriodDraft } from '../types';
import { parsePeriod } from '../validateGrade';
import { FormField } from '../../../components/FormField';
import { FormSheet } from '../../../components/FormSheet';

type Props = {
  subjectId: number;
  initial: GradePeriod | null;
  otherWeight: number; // weight used by the subject's other periods
  onClose: () => void;
  onSave: (draft: PeriodDraft) => void;
  onDelete: (period: GradePeriod) => void;
};

export function PeriodSheet({ subjectId, initial, otherWeight, onClose, onSave, onDelete }: Props) {
  const { colors } = useTheme();
  const [name, setName] = useState(initial?.name ?? '');
  const [weight, setWeight] = useState(initial ? String(initial.weight) : '');

  const submit = () => {
    const result = parsePeriod(subjectId, { name, weight }, otherWeight);
    if ('error' in result) return Alert.alert('Check the form', result.error);
    onSave(result.draft);
  };

  return (
    <FormSheet title={initial ? 'Edit period' : 'Add grading period'} onClose={onClose} onSave={submit}>
      <FormField label="Name" value={name} onChangeText={setName} placeholder="e.g. Prelim" />
      <FormField
        label={`Weight (% of the final grade, ${Math.max(0, 100 - otherWeight)}% still free)`}
        value={weight} onChangeText={setWeight} placeholder="e.g. 25" keyboardType="decimal-pad"
      />
      {initial && (
        <Pressable onPress={() => onDelete(initial)} style={{ marginTop: space.xl, padding: space.md, alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.semibold, color: colors.danger }}>Delete this period</Text>
        </Pressable>
      )}
    </FormSheet>
  );
}