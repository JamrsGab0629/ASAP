import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import { KINDS } from '../kinds';
import type { QuestionType } from '../types';
import type { Outcome } from '../useQuiz';
import { WRONG } from './feedbackColors';

type Props = {
  outcomes: Outcome[];
  studiedMissed: boolean;
  onStudyMissed: () => void;
  onRetake: () => void;
  onDone: () => void;
};

const questionText = (o: Outcome) => {
  const q = o.question;
  return q.type === 'truefalse' ? q.statement.replace('\n→ ', ' → ') : q.prompt;
};

export function QuizResults({ outcomes, studiedMissed, onStudyMissed, onRetake, onDone }: Props) {
  const { colors } = useTheme();
  const total = outcomes.length;
  const points = outcomes.reduce((sum, o) => sum + o.grade.points, 0);
  const percent = total ? Math.round((points / total) * 100) : 0;
  const missed = outcomes.filter((o) => o.grade.points < 1);

  const byType = new Map<QuestionType, { points: number; total: number }>();
  for (const o of outcomes) {
    const row = byType.get(o.question.type) ?? { points: 0, total: 0 };
    byType.set(o.question.type, { points: row.points + o.grade.points, total: row.total + 1 });
  }

  return (
    <View style={{ gap: space.xl }}>
      <View style={{ alignItems: 'center', gap: space.xs }}>
        <Text style={{ fontFamily: fonts.serif, fontSize: 56, color: colors.primary }}>{percent}%</Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted }}>
          {Number.isInteger(points) ? points : points.toFixed(1)} of {total} points
        </Text>
      </View>

      <View style={{ gap: space.sm }}>
        {[...byType.entries()].map(([type, row]) => (
          <View key={type} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fonts.regular, fontSize: 15, color: colors.text }}>{KINDS[type].label}</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: colors.text }}>
              {Number.isInteger(row.points) ? row.points : row.points.toFixed(1)} / {row.total}
            </Text>
          </View>
        ))}
      </View>

      {missed.length > 0 && (
        <View style={{ gap: space.md }}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 17, color: colors.text }}>Review these ({missed.length})</Text>
          {missed.map((o, i) => (
            <View key={i} style={{ gap: space.xs, padding: space.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.text }}>{questionText(o)}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: WRONG }}>Answer: {o.grade.expected}</Text>
            </View>
          ))}
          <Pressable
            onPress={onStudyMissed}
            disabled={studiedMissed}
            style={{ padding: space.lg, borderRadius: radius.lg, alignItems: 'center', borderWidth: 1, borderColor: colors.primary, opacity: studiedMissed ? 0.5 : 1 }}
          >
            <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.primary }}>
              {studiedMissed ? 'Missed cards are due now' : 'Study missed cards'}
            </Text>
          </Pressable>
        </View>
      )}

      <View style={{ gap: space.md }}>
        <Pressable onPress={onRetake} style={{ padding: space.lg, borderRadius: radius.lg, alignItems: 'center', backgroundColor: colors.primary }}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.onPrimary }}>New quiz</Text>
        </Pressable>
        <Pressable onPress={onDone} style={{ padding: space.lg, alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: colors.textMuted }}>Done</Text>
        </Pressable>
      </View>
    </View>
  );
}