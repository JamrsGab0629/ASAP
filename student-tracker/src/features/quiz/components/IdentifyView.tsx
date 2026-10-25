import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { IdentifyQuestion } from '../types';
import type { ViewProps } from './ViewProps';

export function IdentifyView({ question, locked, onSubmit }: ViewProps<IdentifyQuestion>) {
  const { colors } = useTheme();
  const [text, setText] = useState('');

  return (
    <View style={{ gap: space.lg }}>
      <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.primary }}>Type the answer</Text>
      <Text style={{ fontFamily: fonts.serif, fontSize: 22, color: colors.text }}>{question.prompt}</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        editable={!locked}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Your answer"
        placeholderTextColor={colors.textMuted}
        onSubmitEditing={() => text.trim() && onSubmit(text)}
        style={{
          fontFamily: fonts.regular, fontSize: 18, color: colors.text, padding: space.lg, borderRadius: radius.md,
          borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
        }}
      />
      {!locked && (
        <Pressable
          onPress={() => onSubmit(text)}
          disabled={!text.trim()}
          style={{ padding: space.lg, borderRadius: radius.lg, alignItems: 'center', backgroundColor: colors.primary, opacity: text.trim() ? 1 : 0.4 }}
        >
          <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.onPrimary }}>Check</Text>
        </Pressable>
      )}
    </View>
  );
}