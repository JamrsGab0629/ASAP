import type { GradePeriod } from './types';

/** A ready-made list of named, weighted parts. Used for both periods and grading parts. */
export type Preset = {
  id: string;
  label: string;
  parts: { name: string; weight: number }[];
};

export const PERIOD_PRESETS: Preset[] = [
  {
    id: 'four-terms',
    label: 'Prelim, Midterm, Pre-finals, Finals',
    parts: [
      { name: 'Prelim', weight: 25 },
      { name: 'Midterm', weight: 25 },
      { name: 'Pre-finals', weight: 25 },
      { name: 'Finals', weight: 25 },
    ],
  },
  {
    id: 'two-terms',
    label: 'Midterm and Finals',
    parts: [
      { name: 'Midterm', weight: 50 },
      { name: 'Finals', weight: 50 },
    ],
  },
];

export const COMPONENT_PRESETS: Preset[] = [
  {
    id: 'even-five',
    label: 'Five equal parts',
    parts: [
      { name: 'Activities', weight: 20 },
      { name: 'Attendance', weight: 20 },
      { name: 'Exam', weight: 20 },
      { name: 'Quizzes', weight: 20 },
      { name: 'Attitude', weight: 20 },
    ],
  },
  {
    id: 'quiz-activity-exam',
    label: 'Quizzes, activities and exam',
    parts: [
      { name: 'Quizzes', weight: 30 },
      { name: 'Activities', weight: 20 },
      { name: 'Exam', weight: 50 },
    ],
  },
];

export const describePreset = (p: Preset) => p.parts.map((x) => `${x.name} ${x.weight}%`).join(' · ');

/** "Same as Prelim": copies the structure of other periods that already have parts. */
export function presetsFromPeriods(periods: GradePeriod[], currentId: number): Preset[] {
  return periods
    .filter((p) => p.id !== currentId && p.components.length > 0)
    .map((p) => ({
      id: `copy-${p.id}`,
      label: `Same as ${p.name}`,
      parts: p.components.map((c) => ({ name: c.name, weight: c.weight })),
    }));
}