import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import { MAX_REWRITES } from '../improve/rewrite';
import type { RewriteStatus } from '../useNoteScan';

type Props = { status: RewriteStatus; available: boolean; onStart: () => void; onCancel: () => void };

/** Offers to turn fill-in-the-blank cards into real questions with the on-device model. */
export function RewriteBar({ status, available, onStart, onCancel }: Props) {
  const { colors } = useTheme();
  const small = { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted } as const;
  const box = { gap: space.sm, padding: space.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface } as const;

  if (status.kind === 'downloading') {
    return (
      <View style={box}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.text }}>Downloading the model… {status.percent}%</Text>
        <Text style={small}>One time only. Keep this screen open.</Text>
      </View>
    );
  }
  if (status.kind === 'working') {
    return (
      <View style={box}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.text }}>Rewriting {Math.min(status.done + 1, status.total)} of {status.total}…</Text>
        <Pressable onPress={onCancel} hitSlop={8}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.primary }}>Stop after this one</Text>
        </Pressable>
      </View>
    );
  }
  if (status.kind === 'finished') {
    return (
      <View style={box}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.text }}>
          Rewrote {status.rewritten} of {status.total} in {status.seconds}s.
        </Text>
        <Text style={small}>The rest stayed as fill-in-the-blank. Rewritten cards are ticked. Check each one before adding.</Text>
      </View>
    );
  }
  if (!available && status.kind === 'idle') return null;

  return (
    <View style={{ gap: space.xs }}>
      {status.kind === 'failed' && <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.danger }}>{status.message}</Text>}
      <Pressable onPress={onStart} style={{ ...box, borderColor: colors.primary }}>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.primary }}>Rewrite fill-in-the-blank cards as questions</Text>
        <Text style={small}>Uses the on-device model. Up to {MAX_REWRITES} cards, a few seconds each. The answer stays your own note text.</Text>
      </Pressable>
    </View>
  );
}