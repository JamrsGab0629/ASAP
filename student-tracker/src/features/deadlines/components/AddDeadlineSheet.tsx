import { Link } from 'expo-router';
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PickerField } from '@/components/PickerField';
import { SegmentedControl } from '@/components/SegmentedControl';
import { SubjectChips } from '@/components/SubjectChips';
import { fonts, radius, space } from '@/constants/theme';
import { to12h } from '@/lib/clock';
import { formatLongDate } from '@/lib/dates';
import type { SubjectOption } from '@/lib/subjectOptions';
import { useTheme } from '@/theme';
import type { DeadlineDraft } from '../types';
import { useDeadlineForm } from '../useDeadlineForm';
import { validateDeadline } from '../validateDeadline';

type Props = {
  subjects: SubjectOption[];
  onClose: () => void;
  onSave: (draft: DeadlineDraft) => void;
};

export function AddDeadlineSheet({ subjects, onClose, onSave }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const form = useDeadlineForm(subjects);

  const label = (text: string) => (
    <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted, marginTop: space.lg }}>
      {text}
    </Text>
  );

  const submit = () => {
    const draft = form.toDraft();
    const error = validateDeadline(draft);
    if (error || !draft) return Alert.alert('Check the form', error ?? '');
    onSave(draft);
  };

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: space.xl, paddingTop: insets.top + space.lg }}
        >
          <Text style={{ fontFamily: fonts.serif, fontSize: 26, color: colors.text }}>Add deadline</Text>

          {subjects.length === 0 ? (
            <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, marginTop: space.lg }}>
              Add a subject first, then come back.{' '}
              <Link href="/subjects" onPress={onClose} style={{ color: colors.primary }}>
                Open Subjects
              </Link>
            </Text>
          ) : (
            <>
              {label('Title')}
              <TextInput
                value={form.title}
                onChangeText={form.setTitle}
                placeholder="e.g. Problem set 4"
                placeholderTextColor={colors.textMuted}
                style={{
                  fontFamily: fonts.regular, fontSize: 16, color: colors.text,
                  padding: space.md, borderRadius: radius.md, borderWidth: 1,
                  borderColor: colors.border, backgroundColor: colors.surface,
                }}
              />

              {label('Subject')}
              <SubjectChips subjects={subjects} selectedId={form.subjectId} onSelect={form.setSubjectId} />

              {label('Due')}
              <View style={{ flexDirection: 'row', gap: space.md }}>
                <PickerField label="Date" mode="date" value={form.date} display={formatLongDate} onChange={form.setDate} />
                <PickerField label="Time" mode="time" value={form.time} display={to12h} onChange={form.setTime} />
              </View>

              {label('Priority')}
              <SegmentedControl
                accessibilityLabel="Priority"
                value={form.priority}
                onChange={form.setPriority}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                ]}
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