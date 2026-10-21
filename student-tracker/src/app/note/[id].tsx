import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { fonts } from '@/constants/theme';
import { NoteEditor } from '@/features/notes/components/NoteEditor';
import { useNote } from '@/features/notes/useNote';
import { useTheme } from '@/theme';

export default function NoteScreen() {
  const { colors } = useTheme();
  const { id, isNew } = useLocalSearchParams<{ id: string; isNew?: string }>();
  const note = useNote(Number(id));

  if (note === undefined) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  if (note === null) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: fonts.regular, color: colors.textMuted }}>This note no longer exists.</Text>
      </View>
    );
  }
  return <NoteEditor note={note} autoFocus={isNew === '1'} />;
}