import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { FormSheet } from '@/components/FormSheet';
import { SubjectChips } from '@/components/SubjectChips';
import { fonts, radius, space } from '@/constants/theme';
import type { SubjectOption } from '@/lib/subjectOptions';
import { useTheme } from '@/theme';
import { cleanLesson } from '../lesson';
import type { Destination, PickedPhoto, SaveProgress } from '../types';
import { usePhotoDestination } from '../usePhotoDestination';
import { SavingBanner } from './SavingBanner';

type Props = {
  photos: PickedPhoto[];
  subjects: SubjectOption[];
  initialSubjectId: number | null;
  progress: SaveProgress | null;
  onCancel: () => void;
  onConfirm: (destination: Destination) => void;
};

export function AddPhotosSheet({ photos, subjects, initialSubjectId, progress, onCancel, onConfirm }: Props) {
  const { colors } = useTheme();
  const target = usePhotoDestination(initialSubjectId);
  const lesson = cleanLesson(target.lesson);
  const canSave = target.subjectId !== null && lesson !== '' && progress === null;

  return (
    <FormSheet
      title={`Add ${photos.length} photo${photos.length === 1 ? '' : 's'}`}
      onClose={onCancel}
      onSave={() => target.subjectId !== null && onConfirm({ subjectId: target.subjectId, lesson })}
      saveLabel="Save photos"
      saveDisabled={!canSave}
    >
      <View style={{ gap: space.lg, marginTop: space.lg }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
          {photos.slice(0, 8).map((p, i) => (
            <Image key={i} source={{ uri: p.uri }} style={{ width: 64, height: 64, borderRadius: radius.md, backgroundColor: colors.border }} />
          ))}
        </ScrollView>

        <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted }}>File under</Text>
        <SubjectChips subjects={subjects} selectedId={target.subjectId} onSelect={target.setSubjectId} />

        <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted }}>Lesson</Text>
        <TextInput
          value={target.lesson}
          onChangeText={target.setLesson}
          placeholder="e.g. Week 3 or Limits"
          placeholderTextColor={colors.textMuted}
          maxLength={60}
          style={{
            fontFamily: fonts.regular, fontSize: 16, color: colors.text, padding: space.lg, borderRadius: radius.md,
            borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
          }}
        />
        {target.lessons.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
            {target.lessons.map((name) => (
              <Pressable
                key={name}
                onPress={() => target.setLesson(name)}
                style={{
                  paddingVertical: space.sm, paddingHorizontal: space.lg, borderRadius: radius.pill, borderWidth: 1,
                  borderColor: name === lesson ? colors.primary : colors.border,
                  backgroundColor: name === lesson ? colors.tint : 'transparent',
                }}
              >
                <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.text }}>{name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {progress && <SavingBanner progress={progress} />}
      </View>
    </FormSheet>
  );
}