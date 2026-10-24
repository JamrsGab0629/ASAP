import { useMemo } from 'react';
import { Text } from 'react-native';
import { fonts } from '@/constants/theme';
import { useTheme } from '@/theme';
import { buildRuns } from '../buildRuns';
import { HIGHLIGHT_BG } from '../highlightStyle';
import type { Highlight } from '../types';

type Props = {
  body: string;
  highlights: Highlight[];
  onHighlight: (text: string) => void;
  onPressHighlight: (highlight: Highlight) => void;
};

export function HighlightedText({ body, highlights, onHighlight, onPressHighlight }: Props) {
  const { colors } = useTheme();
  const runs = useMemo(() => buildRuns(body, highlights), [body, highlights]);
  const byId = useMemo(() => new Map(highlights.map((h) => [h.id, h])), [highlights]);

  return (
    <Text style={{ fontFamily: fonts.regular, fontSize: 16, lineHeight: 26, color: colors.text }}>
      {runs.map((run, i) => {
        if (run.highlightId !== null) {
          const highlight = byId.get(run.highlightId);
          return (
            <Text key={i} style={{ backgroundColor: HIGHLIGHT_BG }} onPress={highlight ? () => onPressHighlight(highlight) : undefined}>
              {run.text}
            </Text>
          );
        }
        const blank = run.text.trim() === '';
        return (
          <Text key={i} onPress={blank ? undefined : () => onHighlight(run.text)}>
            {run.text}
          </Text>
        );
      })}
    </Text>
  );
}