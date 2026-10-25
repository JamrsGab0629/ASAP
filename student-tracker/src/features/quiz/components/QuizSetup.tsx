import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { SubjectFilter } from '@/features/gallery/components/SubjectFilter';
import type { SubjectOption } from '@/lib/subjectOptions';
import { useTheme } from '@/theme';
import { KIND_LIST } from '../kinds';
import type { QuestionType } from '../types';
import { COUNT_CHOICES } from '../useQuiz';

type Props = {
  subjects: SubjectOption[];
  subjectId: number | null;
  onSubject: (id: number | null) => void;
  count: number;
  onCount: (count: number) => void;
  types: QuestionType[];
  available: Record<QuestionType, number>;
  onToggleType: (type: QuestionType) => void;
  max: number;
  hasCards: boolean;
  onStart: () => void;
};

export function QuizSetup({ subjects, subjectId, onSubject, count, onCount, types, available, onToggleType, max, hasCards, onStart }: Props) {
  const { colors } = useTheme();
  const label = { fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted } as const;
  const canStart = max > 0;

  const chip = (active: boolean, disabled = false) =>
    ({
      paddingVertical: space.sm, paddingHorizontal: space.lg, borderRadius: radius.pill, borderWidth: 1,
      borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.tint : 'transparent', opacity: disabled ? 0.4 : 1,
    }) as const;

  return (
    <View style={{ gap: space.xl }}>
      <View style={{ gap: space.sm }}>
        <Text style={label}>Subject</Text>
        <SubjectFilter subjects={subjects} selectedId={subjectId} onSelect={onSubject} />
      </View>

      <View style={{ gap: space.sm }}>
        <Text style={label}>Question types</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
          {KIND_LIST.map((kind) => {
            const none = available[kind.type] === 0;
            return (
              <Pressable key={kind.type} onPress={() => onToggleType(kind.type)} disabled={none} style={chip(types.includes(kind.type) && !none, none)}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.text }}>
                  {kind.label}{none ? ' · not enough cards' : ` · ${available[kind.type]}`}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ gap: space.sm }}>
        <Text style={label}>Number of questions</Text>
        <View style={{ flexDirection: 'row', gap: space.sm }}>
          {COUNT_CHOICES.map((n) => (
            <Pressable key={n} onPress={() => onCount(n)} style={chip(count === n)}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.text }}>{n}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted }}>
        {!hasCards
          ? 'No flashcards here yet. Make some cards first, then come back for a quiz.'
          : canStart
            ? `${Math.min(count, max)} question${Math.min(count, max) === 1 ? '' : 's'} will be made from your cards.`
            : 'These question types need more cards. Add cards or pick other types.'}
      </Text>

      <Pressable
        onPress={onStart}
        disabled={!canStart}
        style={{ padding: space.lg, borderRadius: radius.lg, alignItems: 'center', backgroundColor: colors.primary, opacity: canStart ? 1 : 0.4 }}
      >
        <Text style={{ fontFamily: fonts.semibold, fontSize: 17, color: colors.onPrimary }}>Start quiz</Text>
      </Pressable>
    </View>
  );
}