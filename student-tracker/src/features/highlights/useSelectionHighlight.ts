import { useEffect, useRef, useState } from 'react';
import type { NativeSyntheticEvent, TextInputSelectionChangeEventData } from 'react-native';
import { useHighlights } from './useHighlights';

const CONFIRM_MS = 1500;

/** Tracks what the student has selected in the text box and lets them turn it into a highlight. */
export function useSelectionHighlight(noteId: number, body: string) {
  const { add } = useHighlights(noteId);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [confirmed, setConfirmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const selectedText = body.slice(selection.start, selection.end).trim();

  const highlight = async () => {
    await add(selectedText);
    setSelection({ start: 0, end: 0 });
    setConfirmed(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setConfirmed(false), CONFIRM_MS);
  };

  return {
    onSelectionChange: (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => setSelection(e.nativeEvent.selection),
    selectedText,
    canHighlight: selectedText.length >= 2,
    confirmed,
    highlight,
  };
}