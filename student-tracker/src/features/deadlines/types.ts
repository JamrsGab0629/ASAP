import type { Priority } from './upcomingDeadlines';

export type DeadlineStatus = 'open' | 'done';

export type DeadlineDraft = {
  subjectId: number;
  title: string;
  dueDate: string; // 'YYYY-MM-DDTHH:mm' local time
  priority: Priority;
};