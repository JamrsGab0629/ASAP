import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import { MODEL } from '../improve/modelConfig';
import { useImproveFront } from '../improve/useImproveFront';

type Props = {
  front: string;
  back: string;
  noteId: number | null;
  onUse: (front: string) => void;
};

/** Asks the on-device model for a clearer front. The student decides whether to use it. */
export function ImproveFrontButton({ front, back, noteId, onUse }: Props) {
  const { colors } = useTheme();
  const { status, start, reset } = useImproveFront();
  const small = { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted } as const;
  const box = { gap: space.sm, padding: space.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface } as const;

  if (status.kind === 'downloading') {
    return (
      <View style={box}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.text }}>Downloading the model… {status.percent}%</Text>
        <Text style={small}>{MODEL.sizeLabel}, one time only. Keep this screen open.</Text>
      </View>
    );
  }

  if (status.kind === 'working') {
    return (
      <View style={{ ...box, flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        <ActivityIndicator color={colors.primary} />
        <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.text }}>Thinking… the first time takes longer</Text>
      </View>
    );
  }

  if (status.kind === 'done') {
    return (
      <View style={box}>
        <Text style={small}>Suggested front</Text>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.text }}>{status.suggestion}</Text>
        <Text style={small}>Loaded in {status.loadSeconds}s, wrote in {status.writeSeconds}s</Text>
        <View style={{ flexDirection: 'row', gap: space.lg }}>
          <Pressable
            onPress={() => {
              onUse(status.suggestion);
              reset();
            }}
          >
            <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.primary }}>Use this</Text>
          </Pressable>
          <Pressable onPress={reset}>
            <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: colors.textMuted }}>Dismiss</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const disabled = !back.trim();
  return (
    <View style={{ gap: space.xs }}>
      {status.kind === 'failed' && <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.danger }}>{status.message}</Text>}
      <Pressable onPress={() => start({ front, back }, noteId)} disabled={disabled} style={{ opacity: disabled ? 0.4 : 1 }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.primary }}>Write a clearer front with the on-device model</Text>
      </Pressable>
    </View>
  );
}