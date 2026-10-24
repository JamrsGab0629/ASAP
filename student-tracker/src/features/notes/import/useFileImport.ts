import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert } from 'react-native';
import type { SubjectOption } from '@/lib/subjectOptions';
import { setLastSubjectId } from '../lastSubjectStore';
import { resolveDefaultSubject } from '../resolveSubject';
import { analyzeFile, type FileAnalysis } from './analyzeFile';
import { importFiles } from './importFiles';
import { pickFiles } from './pickFiles';

export type ImportPhase = 'idle' | 'reading' | 'review' | 'saving';

/** pick files -> read them -> let the student review -> save. */
export function useFileImport(subjects: SubjectOption[], filterSubjectId: number | null, onDone: () => void) {
  const db = useSQLiteContext();
  const [phase, setPhase] = useState<ImportPhase>('idle');
  const [items, setItems] = useState<FileAnalysis[]>([]);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [needsPdf, setNeedsPdf] = useState(false);

  const reset = () => {
    setPhase('idle');
    setItems([]);
    setNeedsPdf(false);
  };

  const start = async () => {
    if (subjects.length === 0) return Alert.alert('Add a subject first', 'Notes are filed under a subject.');
    try {
      const picked = await pickFiles();
      if (picked.length === 0) return;

      setNeedsPdf(picked.some((f) => /\.pdf$/i.test(f.name))); // the PDF reader only starts when a PDF was picked
      setPhase('reading');
      const analyzed: FileAnalysis[] = [];
      for (const file of picked) analyzed.push(await analyzeFile(file)); // one at a time to keep memory low
      setItems(analyzed);
      setSubjectId(await resolveDefaultSubject(db, subjects.map((s) => s.id), filterSubjectId));
      setPhase('review');
    } catch {
      reset();
      Alert.alert("Couldn't open the file picker");
    }
  };

  const confirm = async () => {
    if (subjectId === null) return;
    setPhase('saving');
    const { saved, failed } = await importFiles(db, subjectId, items);
    setLastSubjectId(subjectId);
    reset();
    onDone();
    if (failed > 0) Alert.alert('Some files were not saved', `${saved} saved, ${failed} failed.`);
  };

  return { phase, items, subjectId, setSubjectId, needsPdf, start, confirm, cancel: reset };
}