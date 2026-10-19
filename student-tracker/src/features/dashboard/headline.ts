import { plural } from '@/lib/format';

export function buildHeadline(classCount: number, taskCount: number): string {
  const parts: string[] = [];
  if (classCount > 0) parts.push(`attend ${plural(classCount, 'class', 'classes')}`);
  if (taskCount > 0) parts.push(`finish ${plural(taskCount, 'task', 'tasks')}`);
  return parts.length > 0 ? parts.join(' and ') : 'enjoy a free day';
}