export type GradeItem = {
  id: number;
  componentId: number;
  title: string;
  score: number | null; // null = not scored yet
  maxScore: number;
};

/** One part of the grade, e.g. "Quizzes 20%". */
export type GradeComponent = {
  id: number;
  subjectId: number;
  name: string;
  weight: number; // percent of the final grade
  items: GradeItem[];
};

export type ComponentDraft = { subjectId: number; name: string; weight: number };
export type ItemDraft = { componentId: number; title: string; score: number | null; maxScore: number };

export type ScaleEntry = { minScore: number; equivalent: string };

export type GradeScale = {
  id: number;
  name: string;
  passingGrade: number | null;
  entries: ScaleEntry[]; // sorted best first (highest minScore first)
};