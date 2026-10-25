import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { EnumerateQuestion } from '../types';
import type { ViewProps } from './ViewProps';

export function EnumerateView({ question, locked, onSubmit }: ViewProps<EnumerateQuestion>) {
  const { colors } = useTheme();
  const [items, setItems] = useState<string[]>(() => question.items.map(() => ''));
  const filled = items.some((item) => item.trim());

  const change = (index: number, value: string) => setItems((prev) => prev.map((item, i) => (i === index ? value : item)));

  return (
    <View style={{ gap: space.lg }}>
      <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.primary }}>Enumeration · any order</Text>
      <Text style={{ fontFamily: fonts.serif, fontSize: 22, color: colors.text }}>{question.prompt}</Text>
      {items.map((value, i) => (
        <TextInput
          key={i}
          value={value}
          onChangeText={(text: string) => change(i, text)}
          editable={!locked}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={`Item ${i + 1}`}
          placeholderTextColor={colors.textMuted}
          style={{
            fontFamily: fonts.regular, fontSize: 16, color: colors.text, padding: space.lg, borderRadius: radius.md,
            borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
          }}
        />
      ))}
      {!locked && (
        <Pressable
          onPress={() => onSubmit(items)}
          disabled={!filled}
          style={{ padding: space.lg, borderRadius: radius.lg, alignItems: 'center', backgroundColor: colors.primary, opacity: filled ? 1 : 0.4 }}
        >
          <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.onPrimary }}>Check</Text>
        </Pressable>
      )}
    </View>
  );
}