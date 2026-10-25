import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { resolveDefaultSubject } from '@/features/notes/resolveSubject';
import type { SubjectOption } from '@/lib/subjectOptions';
import { addCard, deleteCard, updateCard } from './cardMutations';
import type { Card, CardDraft } from './types';

type Editing = { card: Card | null; subjectId: number | null };

/** Opening, saving and deleting cards from a sheet. onChanged runs after any change so the list can reload. */
export function useCardEditor(subjects: SubjectOption[], onChanged: () => void) {
  const db = useSQLiteContext();
  const [editing, setEditing] = useState<Editing | null>(null);

  const openNew = async (preferredSubjectId: number | null = null) => {
    const subjectId = await resolveDefaultSubject(db, subjects.map((s) => s.id), preferredSubjectId);
    setEditing({ card: null, subjectId });
  };
  const openEdit = (card: Card) => setEditing({ card, subjectId: card.subjectId });
  const close = () => setEditing(null);

  const save = async (draft: CardDraft) => {
    if (editing?.card) await updateCard(db, editing.card.id, draft);
    else await addCard(db, draft);
    setEditing(null);
    onChanged();
  };

  const remove = async () => {
    if (!editing?.card) return;
    await deleteCard(db, editing.card.id);
    setEditing(null);
    onChanged();
  };

  return { editing, openNew, openEdit, close, save, remove };
}