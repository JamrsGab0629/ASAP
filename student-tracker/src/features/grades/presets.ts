export type ComponentPreset = {
  id: string;
  label: string;
  parts: { name: string; weight: number }[];
};

export const COMPONENT_PRESETS: ComponentPreset[] = [
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

export const describePreset = (p: ComponentPreset) => p.parts.map((x) => `${x.name} ${x.weight}%`).join(' · ');