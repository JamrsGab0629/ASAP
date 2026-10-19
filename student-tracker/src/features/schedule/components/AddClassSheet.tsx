import { Link } from 'expo-router';
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SegmentedControl } from '@/components/SegmentedControl';
import { fonts, radius, space } from '@/constants/theme';
import { formatLongDate } from '@/lib/dates';
import { useTheme } from '@/theme';
import { to12h } from '../../../lib/clock';
import type { ClassDraft, SubjectOption } from '../types';
import { useClassForm } from '../useClassForm';
import { validateDraft } from '../validateDraft';
import { DayChips } from './DayChips';
import { PickerField } from '../../../components/PickerField';
import { SubjectChips } from '../../../components/SubjectChips';

type Props = {
  visible: boolean;
  subjects: SubjectOption[];
  initialDate: Date;
  onClose: () => void;
  onSave: (draft: ClassDraft) => void;
};

export function AddClassSheet({ visible, subjects, initialDate, onClose, onSave }: Props) {
  const { colors } = useTheme();
  const form = useClassForm(subjects, initialDate);

  const label = (text: string) => (
    <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted, marginTop: space.lg }}>
      {text}
    </Text>
  );

  const submit = () => {
    const draft = form.toDraft();
    const error = validateDraft(draft);
    if (error || !draft) return Alert.alert('Check the form', error ?? '');
    onSave(draft);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScrollView contentContainerStyle={{ padding: space.xl, paddingTop: space.xxl * 2 }}>
          <Text style={{ fontFamily: fonts.serif, fontSize: 26, color: colors.text }}>Add class</Text>

          {subjects.length === 0 ? (
            <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, marginTop: space.lg }}>
              Add a subject first, then come back.{' '}
              <Link href="/subjects" onPress={onClose} style={{ color: colors.primary }}>
                Open Subjects
              </Link>
            </Text>
          ) : (
            <>
              {label('Subject')}
              <SubjectChips subjects={subjects} selectedId={form.subjectId} onSelect={form.setSubjectId} />

              <View style={{ marginTop: space.lg }}>
               <SegmentedControl
  accessibilityLabel="Class type"
  value={form.mode}
  onChange={form.setMode}
  options={[
    { value: 'regular', label: 'Weekly' },
    { value: 'makeup', label: 'Makeup' },
  ]}
/>
              </View>

              {form.mode === 'regular' ? (
                <>
                  {label('Days')}
                  <DayChips selected={form.days} onToggle={form.toggleDay} />
                </>
              ) : (
                <>
                  {label('Date')}
                  <View style={{ flexDirection: 'row' }}>
                    <PickerField label="Date" mode="date" value={form.date} display={formatLongDate} onChange={form.setDate} />
                  </View>
                </>
              )}

              {label('Time')}
              <View style={{ flexDirection: 'row', gap: space.md }}>
                <PickerField label="Starts" mode="time" value={form.start} display={to12h} onChange={form.setStart} />
                <PickerField label="Ends" mode="time" value={form.end} display={to12h} onChange={form.setEnd} />
              </View>

              {label('Room (optional)')}
              <TextInput
                value={form.room}
                onChangeText={form.setRoom}
                placeholder="e.g. Room 204"
                placeholderTextColor={colors.textMuted}
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 16,
                  color: colors.text,
                  padding: space.md,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                }}
              />
            </>
          )}
        </ScrollView>

        <View style={{ flexDirection: 'row', gap: space.md, padding: space.xl }}>
          <Pressable
            onPress={onClose}
            style={{ flex: 1, padding: space.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }}
          >
            <Text style={{ fontFamily: fonts.semibold, color: colors.text }}>Cancel</Text>
          </Pressable>
          {subjects.length > 0 && (
            <Pressable
              onPress={submit}
              style={{ flex: 1, padding: space.lg, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center' }}
            >
              <Text style={{ fontFamily: fonts.semibold, color: colors.onPrimary }}>Save</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}