import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { TrueFalseQuestion } from '../types';
import { WRONG } from './feedbackColors';
import type { ViewProps } from './ViewProps';

const SIDES = [
  { label: 'True', value: true },
  { label: 'False', value: false },
];

export function TrueFalseView({ question, locked, onSubmit }: ViewProps<TrueFalseQuestion>) {
  const { colors } = useTheme();
  const [picked, setPicked] = useState<boolean | null>(null);

  const border = (value: boolean) => {
    if (!locked) return colors.border;
    if (value === question.isTrue) return colors.primary;
    return value === picked ? WRONG : colors.border;
  };

  return (
    <View style={{ gap: space.lg }}>
      <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.primary }}>True or false?</Text>
      <Text style={{ fontFamily: fonts.serif, fontSize: 22, color: colors.text }}>{question.statement}</Text>
      <View style={{ flexDirection: 'row', gap: space.md }}>
        {SIDES.map(({ label, value }) => (
          <Pressable
            key={label}
            disabled={locked}
            onPress={() => {
              setPicked(value);
              onSubmit(value);
            }}
            style={{
              flex: 1, padding: space.lg, borderRadius: radius.lg, alignItems: 'center', borderWidth: 2,
              borderColor: border(value), backgroundColor: colors.surface,
            }}
          >
            <Text style={{ fontFamily: fonts.semibold, fontSize: 17, color: colors.text }}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}