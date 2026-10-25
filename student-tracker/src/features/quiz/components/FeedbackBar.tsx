import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { Grade, QuestionType } from '../types';
import { WRONG } from './feedbackColors';
import { CAN_OVERRULE } from './questionViews';

type Props = { grade: Grade; type: QuestionType; isLast: boolean; onOverrule: () => void; onNext: () => void };

function headline(grade: Grade) {
  if (grade.correct) return 'Correct!';
  return grade.points > 0 ? `Partly right (${Math.round(grade.points * 100)}%)` : 'Not quite';
}

export function FeedbackBar({ grade, type, isLast, onOverrule, onNext }: Props) {
  const { colors } = useTheme();
  const tone = grade.correct ? colors.primary : WRONG;

  return (
    <View style={{ gap: space.md, padding: space.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: tone, backgroundColor: colors.surface }}>
      <Text style={{ fontFamily: fonts.semibold, fontSize: 17, color: tone }}>{headline(grade)}</Text>
      {!grade.correct && (
        <Text style={{ fontFamily: fonts.regular, fontSize: 15, color: colors.text }}>Answer: {grade.expected}</Text>
      )}
      {!grade.correct && CAN_OVERRULE.includes(type) && (
        <Pressable onPress={onOverrule} hitSlop={8}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.primary }}>I was right, mark me correct</Text>
        </Pressable>
      )}
      <Pressable onPress={onNext} style={{ padding: space.lg, borderRadius: radius.lg, alignItems: 'center', backgroundColor: colors.primary }}>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.onPrimary }}>{isLast ? 'See results' : 'Next'}</Text>
      </Pressable>
    </View>
  );
}