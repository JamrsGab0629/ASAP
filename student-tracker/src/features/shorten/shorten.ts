import { extractiveShortener } from './extractive';
import { splitUnits } from './splitUnits';
import type { Block, Shortener, ShortenResult } from './types';
import { countWords } from './words';

const MIN_WORDS_TO_SHORTEN = 60;

/** Gives a reworded version of a kept sentence, or undefined to keep it as written. */
export type Rewrite = (sentence: string) => string | undefined;

/** Shortens a note and keeps track of what was hidden, so the student can bring it back. */
export function shorten(
  body: string,
  ratio: number,
  shortener: Shortener = extractiveShortener,
  rewrite?: Rewrite,
): ShortenResult {
  const totalWords = countWords(body);
  const whole: ShortenResult = {
    blocks: [{ kind: 'kept', text: body, hiddenCount: 0 }],
    keptWords: totalWords,
    totalWords,
    shortened: false,
    keptSentences: [],
    rewritten: 0,
  };
  if (ratio >= 1 || totalWords < MIN_WORDS_TO_SHORTEN) return whole;

  const units = splitUnits(body);
  const chosen = shortener.choose(units, ratio);

  const blocks: Block[] = [];
  const keptSentences: string[] = [];
  let keptWords = 0;
  let rewritten = 0;
  units.forEach((unit, index) => {
    const kept = unit.heading || chosen.has(index);
    let text = unit.text;
    let words = unit.words;
    if (kept && !unit.heading) {
      const sentence = unit.text.trim();
      keptSentences.push(sentence);
      const replacement = rewrite?.(sentence);
      if (replacement) {
        text = replacement + (unit.text.match(/\s*$/)?.[0] ?? '');
        words = countWords(replacement);
        rewritten++;
      }
    }
    if (kept) keptWords += words;
    const kind = kept ? 'kept' : 'hidden';
    const last = blocks[blocks.length - 1];
    if (last && last.kind === kind) {
      last.text += text;
      if (!kept) last.hiddenCount++;
    } else {
      blocks.push({ kind, text, hiddenCount: kept ? 0 : 1 });
    }
  });

  return { blocks, keptWords, totalWords, shortened: true, keptSentences, rewritten };
}