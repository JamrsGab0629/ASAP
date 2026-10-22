import { ActivityIndicator, Text, View } from 'react-native';
import { FormSheet } from '@/components/FormSheet';
import { SubjectChips } from '@/components/SubjectChips';
import { fonts, space } from '@/constants/theme';
import type { SubjectOption } from '@/lib/subjectOptions';
import { useTheme } from '@/theme';
import type { FileAnalysis } from '../import/analyzeFile';
import type { ImportPhase } from '../import/useFileImport';
import { ImportItemRow } from './ImportItemRow';

type Props = {
  phase: Exclude<ImportPhase, 'idle'>;
  items: FileAnalysis[];
  subjects: SubjectOption[];
  subjectId: number | null;
  onSubjectChange: (id: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ImportSheet({ phase, items, subjects, subjectId, onSubjectChange, onCancel, onConfirm }: Props) {
  const { colors } = useTheme();
  const readyCount = items.filter((i) => i.status === 'ready').length;
  const busy = phase === 'reading' || phase === 'saving';

  return (
    <FormSheet
      title="Import files"
      onClose={onCancel}
      onSave={onConfirm}
      saveLabel={readyCount > 0 ? `Import ${readyCount} file${readyCount === 1 ? '' : 's'}` : 'Import'}
      saveDisabled={busy || readyCount === 0 || subjectId === null}
    >
      {busy ? (
        <View style={{ alignItems: 'center', gap: space.md, marginTop: space.xxl }}>
          <ActivityIndicator color={colors.primary} />
          <Text style={{ fontFamily: fonts.regular, color: colors.textMuted }}>
            {phase === 'reading' ? 'Reading your files…' : 'Saving…'}
          </Text>
        </View>
      ) : (
        <View style={{ gap: space.lg, marginTop: space.lg }}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted }}>File under</Text>
          <SubjectChips subjects={subjects} selectedId={subjectId} onSelect={onSubjectChange} />
          {items.map((item, index) => (
            <ImportItemRow key={index} item={item} />
          ))}
        </View>
      )}
    </FormSheet>
  );
}