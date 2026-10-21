import { useState } from 'react';
import { Alert, View } from 'react-native';
import { FormField } from '@/components/FormField';
import { FormSheet } from '@/components/FormSheet';
import { SegmentedControl } from '@/components/SegmentedControl';
import { space } from '@/constants/theme';
import { EVERY_PERIOD, PERIOD_OPTIONS, type PeriodType } from '../period';
import { parseAmount } from '../validateEntry';

type Props = {
  initial: { type: PeriodType; amount: number } | null;
  onClose: () => void;
  onSave: (type: PeriodType, amount: number) => void;
};

export function AllowanceSheet({ initial, onClose, onSave }: Props) {
  const [type, setType] = useState<PeriodType>(initial?.type ?? 'week');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');

  const submit = () => {
    const value = parseAmount(amount);
    if (!(value > 0) || !Number.isFinite(value)) return Alert.alert('Check the form', 'Enter an amount more than 0.');
    onSave(type, value);
  };

  return (
    <FormSheet title="Your allowance" onClose={onClose} onSave={submit}>
      <View style={{ marginTop: space.lg }}>
        <SegmentedControl accessibilityLabel="How often you get your allowance" value={type} onChange={setType} options={PERIOD_OPTIONS} />
      </View>
      <FormField
        label={`Amount you get every ${EVERY_PERIOD[type]} (₱)`}
        value={amount} onChangeText={setAmount} placeholder="e.g. 1000" keyboardType="decimal-pad"
      />
    </FormSheet>
  );
}