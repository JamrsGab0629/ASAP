import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { ChoiceQuestion } from '../types';
import { WRONG } from './feedbackColors';
import type { ViewProps } from './ViewProps';

export function ChoiceView({ question, locked, onSubmit }: ViewProps<ChoiceQuestion>) {
  const { colors } = useTheme();
  const [picked, setPicked] = useState<number | null>(null);

  const border = (i: number) => {
    if (!locked) return colors.border;
    if (i === question.correctIndex) return colors.primary;
    return i === picked ? WRONG : colors.border;
  };

  return (
    <View style={{ gap: space.lg }}>
      <Text style={{ fontFamily: fonts.serif, fontSize: 22, color: colors.text }}>{question.prompt}</Text>
      {question.options.map((option, i) => (
        <Pressable
          key={i}
          disabled={locked}
          onPress={() => {
            setPicked(i);
            onSubmit(i);
          }}
          style={{ padding: space.lg, borderRadius: radius.lg, borderWidth: 2, borderColor: border(i), backgroundColor: colors.surface }}
        >
          <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.text }}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}