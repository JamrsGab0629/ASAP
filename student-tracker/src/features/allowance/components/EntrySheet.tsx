import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { FormField } from '@/components/FormField';
import { FormSheet } from '@/components/FormSheet';
import { PickerField } from '@/components/PickerField';
import { SegmentedControl } from '@/components/SegmentedControl';
import { fonts, space } from '@/constants/theme';
import { formatLongDate } from '@/lib/dates';
import { useTheme } from '@/theme';
import { EXPENSE_CATEGORIES } from '../category';
import { parseISODate } from '../period';
import type { Entry, EntryDraft, EntryType } from '../types';
import { parseEntry } from '../validateEntry';
import { CategoryChips } from './CategoryChips';

type Props = { initial: Entry | null; onClose: () => void; onSave: (draft: EntryDraft) => void };

export function EntrySheet({ initial, onClose, onSave }: Props) {
  const { colors } = useTheme();
  const [type, setType] = useState<EntryType>(initial?.type ?? 'expense');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [category, setCategory] = useState<string | null>(initial?.category ?? EXPENSE_CATEGORIES[0]);
  const [note, setNote] = useState(initial?.note ?? '');
  const [date, setDate] = useState<Date>(initial ? parseISODate(initial.date) : new Date());

  const submit = () => {
    const result = parseEntry({ type, amount, category, note, date });
    if ('error' in result) return Alert.alert('Check the form', result.error);
    onSave(result.draft);
  };

  return (
    <FormSheet title={initial ? 'Edit entry' : 'Add entry'} onClose={onClose} onSave={submit}>
      <View style={{ marginTop: space.lg }}>
        <SegmentedControl
          accessibilityLabel="Entry type"
          value={type}
          onChange={setType}
          options={[
            { value: 'expense', label: 'Expense' },
            { value: 'income', label: 'Extra money' },
          ]}
        />
      </View>
      <FormField label="Amount (₱)" value={amount} onChangeText={setAmount} placeholder="e.g. 85" keyboardType="decimal-pad" />
      {type === 'expense' && (
        <View style={{ gap: space.sm, marginTop: space.lg }}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted }}>Category</Text>
          <CategoryChips options={EXPENSE_CATEGORIES} selected={category} onSelect={setCategory} />
        </View>
      )}
      <FormField label="Note (optional)" value={note} onChangeText={setNote} placeholder="e.g. Lunch" />
      <View style={{ flexDirection: 'row', marginTop: space.lg }}>
        <PickerField label="Date" mode="date" value={date} display={formatLongDate} onChange={setDate} />
      </View>
    </FormSheet>
  );
}