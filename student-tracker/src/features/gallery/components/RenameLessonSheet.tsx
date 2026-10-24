import { useState } from 'react';
import { TextInput } from 'react-native';
import { FormSheet } from '@/components/FormSheet';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import { cleanLesson } from '../lesson';

type Props = { lesson: string; onCancel: () => void; onSave: (name: string) => void };

export function RenameLessonSheet({ lesson, onCancel, onSave }: Props) {
  const { colors } = useTheme();
  const [name, setName] = useState(lesson);
  return (
    <FormSheet title="Rename lesson" onClose={onCancel} onSave={() => onSave(name)} saveDisabled={cleanLesson(name) === ''}>
      <TextInput
        value={name}
        onChangeText={setName}
        autoFocus
        maxLength={60}
        placeholderTextColor={colors.textMuted}
        style={{
          marginTop: space.lg, fontFamily: fonts.regular, fontSize: 16, color: colors.text, padding: space.lg,
          borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
        }}
      />
    </FormSheet>
  );
}