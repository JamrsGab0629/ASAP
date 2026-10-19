import { useState } from 'react';
import { toISODate } from '@/lib/dates';
import { fromHHMM, toHHMM } from '../../lib/clock';
import type { ClassDraft, SubjectOption } from './types';

export type ClassMode = 'regular' | 'makeup';

export function useClassForm(subjects: SubjectOption[], initialDate: Date) {
  const [subjectId, setSubjectId] = useState<number | null>(subjects[0]?.id ?? null);
  const [mode, setMode] = useState<ClassMode>('regular');
  const [days, setDays] = useState<number[]>([initialDate.getDay()]);
  const [date, setDate] = useState<Date>(initialDate);
  const [start, setStart] = useState<Date>(fromHHMM('08:00'));
  const [end, setEnd] = useState<Date>(fromHHMM('09:30'));
  const [room, setRoom] = useState('');

  const toggleDay = (d: number) =>
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()));

  const toDraft = (): ClassDraft | null => {
    if (subjectId === null) return null;
    const base = { subjectId, start: toHHMM(start), end: toHHMM(end), room: room.trim() || null };
    return mode === 'makeup'
      ? { kind: 'makeup', ...base, date: toISODate(date) }
      : { kind: 'regular', ...base, days };
  };

  return {
    subjectId, setSubjectId, mode, setMode, days, toggleDay,
    date, setDate, start, setStart, end, setEnd, room, setRoom, toDraft,
  };
}