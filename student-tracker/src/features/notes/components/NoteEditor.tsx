import { useRouter } from 'expo-router';
import { ChevronLeft, Star, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Keyboard, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SubjectChips } from '@/components/SubjectChips';
import { fonts, space } from '@/constants/theme';
import { HighlightSelectionBar } from '@/features/highlights/components/HighlightSelectionBar';
import { ModeToggle, type NoteMode } from '@/features/highlights/components/ModeToggle';
import { NoteReadView } from '@/features/highlights/components/NoteReadView';
import { useSelectionHighlight } from '@/features/highlights/useSelectionHighlight';
import { useSubjectOptions } from '@/hooks/useSubjectOptions';
import { useTheme } from '@/theme';
import type { Note } from '../types';
import { useNoteEditor } from '../useNoteEditor';
import { AttachmentBar } from './AttachmentBar';

type Props = { note: Note; autoFocus: boolean };

/** Imported lectures are for reading; everything else opens ready to type. */
const startingMode = (note: Note, autoFocus: boolean): NoteMode => (note.filePath && !autoFocus ? 'read' : 'write');

export function NoteEditor({ note, autoFocus }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const subjects = useSubjectOptions();
  const editor = useNoteEditor(note);
  const selection = useSelectionHighlight(note.id, editor.body);
  const [mode, setMode] = useState<NoteMode>(() => startingMode(note, autoFocus));

  const changeMode = (next: NoteMode) => {
    if (next === 'read') Keyboard.dismiss();
    setMode(next);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: space.lg, paddingTop: insets.top + space.sm, paddingBottom: space.sm,
        }}
      >
        <Pressable onPress={() => router.back()} accessibilityLabel="Back" hitSlop={10}>
          <ChevronLeft size={26} color={colors.text} />
        </Pressable>
        <ModeToggle mode={mode} onChange={changeMode} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xl }}>
          <Pressable onPress={editor.toggleStar} accessibilityLabel="Mark for review" hitSlop={10}>
            <Star size={22} color={editor.starred ? colors.primary : colors.textMuted} fill={editor.starred ? colors.primary : 'transparent'} />
          </Pressable>
          <Pressable onPress={editor.remove} accessibilityLabel="Delete note" hitSlop={10}>
            <Trash2 size={22} color={colors.textMuted} />
          </Pressable>
        </View>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: space.xl, paddingTop: space.md, gap: space.lg }}>
        <SubjectChips subjects={subjects} selectedId={editor.subjectId} onSelect={editor.changeSubject} />
        {note.filePath && <AttachmentBar filePath={note.filePath} />}
        <TextInput
          value={editor.title}
          onChangeText={editor.setTitle}
          placeholder="Title (optional)"
          placeholderTextColor={colors.textMuted}
          style={{ fontFamily: fonts.serif, fontSize: 26, color: colors.text, padding: 0 }}
        />
        {mode === 'write' ? (
          <TextInput
            value={editor.body}
            onChangeText={editor.setBody}
            onSelectionChange={selection.onSelectionChange}
            placeholder="Start typing. Add #tags anywhere."
            placeholderTextColor={colors.textMuted}
            autoFocus={autoFocus}
            multiline
            scrollEnabled={false}
            textAlignVertical="top"
            style={{ fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, color: colors.text, minHeight: 320, padding: 0 }}
          />
        ) : (
          <NoteReadView noteId={note.id} body={editor.body} />
        )}
      </ScrollView>

      {mode === 'write' && (
        <HighlightSelectionBar
          visible={selection.canHighlight}
          preview={selection.selectedText}
          confirmed={selection.confirmed}
          onPress={selection.highlight}
        />
      )}
    </View>
  );
}