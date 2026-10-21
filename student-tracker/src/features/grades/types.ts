export type GradeItem = {
  id: number;
  componentId: number;
  title: string;
  score: number | null; // null = not scored yet
  maxScore: number;
};

/** One part of a period, e.g. "Quizzes 20%". */
export type GradeComponent = {
  id: number;
  periodId: number;
  name: string;
  weight: number; // percent of the period's grade
  items: GradeItem[];
};

/** One grading period, e.g. "Prelim 25%". */
export type GradePeriod = {
  id: number;
  subjectId: number;
  name: string;
  weight: number; // percent of the final grade
  components: GradeComponent[];
};

export type PeriodDraft = { subjectId: number; name: string; weight: number };
export type ComponentDraft = { periodId: number; name: string; weight: number };
export type ItemDraft = { componentId: number; title: string; score: number | null; maxScore: number };

export type ScaleEntry = { minScore: number; equivalent: string };

export type GradeScale = {
  id: number;
  name: string;
  passingGrade: number | null;
  entries: ScaleEntry[]; // sorted best first (highest minScore first)
};