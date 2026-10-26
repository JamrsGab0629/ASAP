import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts, space } from '@/constants/theme';
import { FeedbackBar } from '@/features/quiz/components/FeedbackBar';
import { QuizResults } from '@/features/quiz/components/QuizResults';
import { QuizSetup } from '@/features/quiz/components/QuizSetup';
import { QUESTION_VIEWS } from '@/features/quiz/components/questionViews';
import { useQuiz } from '@/features/quiz/useQuiz';
import { useSubjectOptions } from '@/hooks/useSubjectOptions';
import { useTheme } from '@/theme';

export default function QuizScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const subjects = useSubjectOptions();
  const { subjectId: param } = useLocalSearchParams<{ subjectId?: string }>();
  const quiz = useQuiz(param ? Number(param) : null);
  const scroll = useRef<ScrollView>(null);

  const question = quiz.questions[quiz.index];
  const QuestionView = question ? QUESTION_VIEWS[question.type] : null;
  const title = quiz.phase === 'results' ? 'Results' : quiz.phase === 'playing' ? `Question ${quiz.index + 1} of ${quiz.questions.length}` : 'Quiz';

  // After an answer, bring the feedback and the Next button into view. For a new question or the results, go back to the top.
  useEffect(() => {
    if (quiz.phase === 'playing' && quiz.current) {
      const timer = setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 60);
      return () => clearTimeout(timer);
    }
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [quiz.phase, quiz.index, quiz.current]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        ref={scroll}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: space.xl, paddingTop: insets.top + space.lg, paddingBottom: insets.bottom + space.xxl, gap: space.xl }}
      >
        <View style={{ gap: space.md }}>
          <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Back">
            <ChevronLeft size={26} color={colors.text} />
          </Pressable>
          <Text style={{ fontFamily: fonts.serif, fontSize: 28, color: colors.text }}>{title}</Text>
        </View>

        {quiz.phase === 'setup' && (
          <QuizSetup
            subjects={subjects}
            subjectId={quiz.subjectId}
            onSubject={quiz.setSubjectId}
            count={quiz.count}
            onCount={quiz.setCount}
            types={quiz.types}
            available={quiz.available}
            onToggleType={quiz.toggleType}
            max={quiz.max}
            hasCards={quiz.hasCards}
            onStart={quiz.start}
            skipped={quiz.skipped}
            ai={quiz.ai}
          />
        )}

        {quiz.phase === 'playing' && question && QuestionView && (
          <View style={{ gap: space.xl }}>
            <QuestionView key={`${quiz.index}-${question.cardId}`} question={question} locked={quiz.current !== null} onSubmit={quiz.submit} />
            {quiz.current && (
              <FeedbackBar
                grade={quiz.current}
                type={question.type}
                isLast={quiz.index + 1 === quiz.questions.length}
                onOverrule={quiz.markCorrect}
                onNext={quiz.next}
              />
            )}
          </View>
        )}

        {quiz.phase === 'results' && (
          <QuizResults
            outcomes={quiz.outcomes}
            studiedMissed={quiz.studiedMissed}
            onStudyMissed={quiz.studyMissed}
            onRetake={quiz.backToSetup}
            onDone={() => router.back()}
          />
        )}
      </ScrollView>
    </View>
  );
}