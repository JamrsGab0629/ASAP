import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { SimplifyStatus } from '../simplify/useSimplifiedShorten';

type Props = {
  status: SimplifyStatus;
  /** Sentences that still need the model */
  pendingCount: number;
  /** Sentences already reworded in what is shown */
  rewrittenCount: number;
  onStart: () => void;
  onCancel: () => void;
};

/** Starts the AI rewording, shows its progress, and lets the student stop. */
export function SimplifyBar({ status, pendingCount, rewrittenCount, onStart, onCancel }: Props) {
  const { colors } = useTheme();
  const note = (text: string) => (
    <Text style={{ fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted }}>{text}</Text>
  );
  const button = (label: string, onPress: () => void, filled: boolean) => (
    <Pressable
      onPress={onPress}
      style={{
        alignSelf: 'flex-start', paddingVertical: space.sm, paddingHorizontal: space.lg, borderRadius: radius.pill,
        borderWidth: 1, borderColor: colors.primary, backgroundColor: filled ? colors.primary : 'transparent',
      }}
    >
      <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: filled ? colors.onPrimary : colors.text }}>{label}</Text>
    </Pressable>
  );

  let content;
  if (status.kind === 'downloading') {
    content = note(`Downloading the model… ${status.percent}%`);
  } else if (status.kind === 'working') {
    content = (
      <>
        {note(`Rewording sentence ${Math.min(status.done + 1, status.total)} of ${status.total}…`)}
        {button('Stop', onCancel, false)}
      </>
    );
  } else if (status.kind === 'failed') {
    content = (
      <>
        {note(status.message)}
        {button('Try again', onStart, true)}
      </>
    );
  } else if (pendingCount > 0) {
    content = (
      <>
        {note(`${pendingCount} sentence${pendingCount === 1 ? '' : 's'} can be tightened by AI. About ${Math.ceil(pendingCount * 1.3)} seconds, offline.`)}
        {button('Tighten with AI', onStart, true)}
      </>
    );
  } else {
    content = note(
      rewrittenCount > 0
        ? `${rewrittenCount} sentence${rewrittenCount === 1 ? '' : 's'} tightened by AI. It only removes words, never adds them. Highlighting is off in this view.`
        : 'Nothing here needed tightening.',
    );
  }

  return (
    <View style={{ gap: space.sm, padding: space.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border }}>{content}</View>
  );
}