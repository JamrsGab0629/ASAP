import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useState } from 'react';
import { availability, buildQuiz, maxQuestions } from './buildQuiz';
import { gradeAnswer, KIND_LIST } from './kinds';
import { loadQuizCards } from './quizQueries';
import { makeCardsDue, saveQuizResult } from './quizMutations';
import type { Answer, Grade, Question, QuestionType, QuizCard } from './types';

export type Phase = 'setup' | 'playing' | 'results';
export type Outcome = { question: Question; grade: Grade };

export const ALL_TYPES: QuestionType[] = KIND_LIST.map((kind) => kind.type);
export const COUNT_CHOICES = [5, 10, 20];

export function useQuiz(initialSubjectId: number | null) {
  const db = useSQLiteContext();
  const [subjectId, setSubjectId] = useState<number | null>(initialSubjectId);
  const [cards, setCards] = useState<QuizCard[]>([]);
  const [count, setCount] = useState(10);
  const [types, setTypes] = useState<QuestionType[]>(ALL_TYPES);

  const [phase, setPhase] = useState<Phase>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [current, setCurrent] = useState<Grade | null>(null); // the grade of the question on screen
  const [studiedMissed, setStudiedMissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadQuizCards(db, subjectId).then((loaded) => {
      if (!cancelled) setCards(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [db, subjectId]);

  const available = useMemo(() => availability(cards), [cards]);
  const usable = useMemo(() => types.filter((type) => available[type] > 0), [types, available]);
  const max = useMemo(() => maxQuestions(cards, usable), [cards, usable]);

  const toggleType = (type: QuestionType) =>
    setTypes((prev) => (prev.includes(type) ? (prev.length > 1 ? prev.filter((t) => t !== type) : prev) : [...prev, type]));

  const start = () => {
    const built = buildQuiz(cards, { count, types: usable }, Math.random);
    if (built.length === 0) return;
    setQuestions(built);
    setIndex(0);
    setOutcomes([]);
    setCurrent(null);
    setStudiedMissed(false);
    setPhase('playing');
  };

  const submit = (answer: Answer) => {
    if (current) return;
    setCurrent(gradeAnswer(questions[index], answer));
  };

  /** For typed answers that were right but worded differently. */
  const markCorrect = () => setCurrent((grade) => (grade ? { ...grade, points: 1, correct: true } : grade));

  const next = async () => {
    if (!current) return;
    const done = [...outcomes, { question: questions[index], grade: current }];
    setOutcomes(done);
    setCurrent(null);
    if (index + 1 < questions.length) return setIndex(index + 1);

    await saveQuizResult(db, {
      subjectId,
      questionCount: done.length,
      points: done.reduce((sum, o) => sum + o.grade.points, 0),
    });
    setPhase('results');
  };

  const studyMissed = async () => {
    const missed = outcomes.filter((o) => o.grade.points < 1).map((o) => o.question.cardId);
    await makeCardsDue(db, missed);
    setStudiedMissed(true);
  };

  const backToSetup = () => setPhase('setup');

  return {
    subjectId, setSubjectId, count, setCount, types, toggleType, available, max, hasCards: cards.length > 0,
    phase, questions, index, current, outcomes, studiedMissed,
    start, submit, markCorrect, next, studyMissed, backToSetup,
  };
}