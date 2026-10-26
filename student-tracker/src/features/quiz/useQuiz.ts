import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { availability, buildQuiz, maxQuestions } from './buildQuiz';
import { isBrokenCard } from '@/features/flashcards/cardQuality';
import { ensureModelReady } from '@/features/flashcards/improve/ensureModel';
import { MODEL } from '@/features/flashcards/improve/modelConfig';
import { isModelDownloaded } from '@/features/flashcards/improve/modelFiles';
import { useBooleanSetting } from '@/lib/useBooleanSetting';
import { improveChoices } from './ai/improveChoices';
import { llamaWriter } from './ai/llamaWriter';
import type { PrepStatus, QuizAi } from './ai/status';
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
  const [skipped, setSkipped] = useState(0); // cards left out because their front is a label, not a question
  const [count, setCount] = useState(10);
  const [types, setTypes] = useState<QuestionType[]>(ALL_TYPES);

  const [phase, setPhase] = useState<Phase>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [current, setCurrent] = useState<Grade | null>(null); // the grade of the question on screen
  const [studiedMissed, setStudiedMissed] = useState(false);

  const useAi = useBooleanSetting('quiz_use_ai', false);
  const [prep, setPrep] = useState<PrepStatus>({ kind: 'idle' });
  const stopped = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadQuizCards(db, subjectId).then((loaded) => {
      if (cancelled) return;
      const ready = loaded.filter((card) => !isBrokenCard(card));
      setCards(ready);
      setSkipped(loaded.length - ready.length);
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

  const begin = (built: Question[]) => {
    setQuestions(built);
    setIndex(0);
    setOutcomes([]);
    setCurrent(null);
    setStudiedMissed(false);
    setPhase('playing');
  };

  /** Lets the model write better wrong answers for the multiple-choice questions, then starts. Stopping keeps the rest as they were. */
  const startWithAi = async (built: Question[]) => {
    stopped.current = false;
    try {
      setPrep({ kind: 'working', done: 0, total: built.filter((q) => q.type === 'choice').length });
      await ensureModelReady((percent) => setPrep({ kind: 'downloading', percent }));
      const improved = await improveChoices(
        built,
        llamaWriter,
        Math.random,
        (progress) => setPrep({ kind: 'working', ...progress }),
        () => stopped.current,
      );
      setPrep({ kind: 'idle' });
      begin(improved);
    } catch (error) {
      setPrep({ kind: 'failed', message: error instanceof Error ? error.message : 'Something went wrong.' });
    }
  };

  const start = async () => {
    const built = buildQuiz(cards, { count, types: usable }, Math.random);
    if (built.length === 0) return;
    if (!useAi.value || !built.some((q) => q.type === 'choice')) return begin(built);
    if (await isModelDownloaded()) return startWithAi(built);
    Alert.alert(
      'Download the model?',
      `This needs a one-time download of about ${MODEL.sizeLabel}. Use Wi-Fi. After that it works offline.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => startWithAi(built) },
      ],
    );
  };

  const ai: QuizAi = {
    enabled: useAi.value,
    onToggle: useAi.set,
    status: prep,
    onStop: () => {
      stopped.current = true;
    },
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
    subjectId, setSubjectId, count, setCount, types, toggleType, available, max, hasCards: cards.length > 0, skipped,
    phase, questions, index, current, outcomes, studiedMissed,
    start, submit, markCorrect, next, studyMissed, backToSetup, ai,
  };
}