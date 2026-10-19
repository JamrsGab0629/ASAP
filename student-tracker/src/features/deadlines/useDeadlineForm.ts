import { useState } from 'react';
import { addDays } from '@/lib/dates';
import { fromHHMM } from '@/lib/clock';
import { combineDateAndTime, toDueDateString } from './dueDate';
import type { DeadlineDraft } from './types';
import type { Priority } from './upcomingDeadlines';
import type { SubjectOption } from '@/lib/subjectOptions';

export function useDeadlineForm(subjects: SubjectOption[]) {
  const [subjectId, setSubjectId] = useState<number | null>(subjects[0]?.id ?? null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date>(() => addDays(new Date(), 1));
  const [time, setTime] = useState<Date>(fromHHMM('23:59'));
  const [priority, setPriority] = useState<Priority>('medium');

  const toDraft = (): DeadlineDraft | null =>
    subjectId === null
      ? null
      : { subjectId, title: title.trim(), priority, dueDate: toDueDateString(combineDateAndTime(date, time)) };

  return { subjectId, setSubjectId, title, setTitle, date, setDate, time, setTime, priority, setPriority, toDraft };
}