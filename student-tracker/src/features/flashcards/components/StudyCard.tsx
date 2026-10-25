import { Pressable, ScrollView, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';

type Props = { front: string; back: string; revealed: boolean; onReveal: () => void };

/** The card. Tap anywhere to show the answer. */
export function StudyCard({ front, back, revealed, onReveal }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={revealed ? undefined : onReveal} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', gap: space.xl, padding: space.xl }}
        style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}
      >
        <Text style={{ fontFamily: fonts.serif, fontSize: 24, lineHeight: 34, color: colors.text, textAlign: 'center' }}>{front}</Text>
        {revealed ? (
          <>
            <View style={{ height: 1, backgroundColor: colors.border }} />
            <Text style={{ fontFamily: fonts.regular, fontSize: 19, lineHeight: 29, color: colors.text, textAlign: 'center' }}>{back}</Text>
          </>
        ) : (
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, textAlign: 'center' }}>Tap to show the answer</Text>
        )}
      </ScrollView>
    </Pressable>
  );
}