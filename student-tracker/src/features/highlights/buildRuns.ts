import { splitSentences } from '../../lib/splitSentences';
import type { Highlight, Run } from './types';

type Range = { start: number; end: number; id: number };

/** Finds where each highlight sits in the body. Overlapping matches are skipped. */
function locate(body: string, highlights: Highlight[]): Range[] {
  const taken: Range[] = [];
  for (const h of highlights) {
    let from = 0;
    for (;;) {
      const start = body.indexOf(h.text, from);
      if (start === -1) break; // the text was edited away; the highlight simply isn't shown
      const end = start + h.text.length;
      if (!taken.some((r) => start < r.end && end > r.start)) {
        taken.push({ start, end, id: h.id });
        break;
      }
      from = start + 1;
    }
  }
  return taken.sort((a, b) => a.start - b.start);
}

/** Body + highlights -> pieces to draw: highlighted phrases, and the rest cut into tappable sentences. */
export function buildRuns(body: string, highlights: Highlight[]): Run[] {
  const runs: Run[] = [];
  const addPlain = (text: string) => splitSentences(text).forEach((piece) => runs.push({ text: piece, highlightId: null }));

  let cursor = 0;
  for (const range of locate(body, highlights)) {
    addPlain(body.slice(cursor, range.start));
    runs.push({ text: body.slice(range.start, range.end), highlightId: range.id });
    cursor = range.end;
  }
  addPlain(body.slice(cursor));
  return runs;
}