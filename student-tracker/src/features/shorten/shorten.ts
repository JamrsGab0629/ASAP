import { extractiveShortener } from './extractive';
import { splitUnits } from './splitUnits';
import type { Block, Shortener, ShortenResult } from './types';
import { countWords } from './words';

const MIN_WORDS_TO_SHORTEN = 60;

/** Shortens a note and keeps track of what was hidden, so the student can bring it back. */
export function shorten(body: string, ratio: number, shortener: Shortener = extractiveShortener): ShortenResult {
  const totalWords = countWords(body);
  const whole: ShortenResult = {
    blocks: [{ kind: 'kept', text: body, hiddenCount: 0 }],
    keptWords: totalWords,
    totalWords,
    shortened: false,
  };
  if (ratio >= 1 || totalWords < MIN_WORDS_TO_SHORTEN) return whole;

  const units = splitUnits(body);
  const chosen = shortener.choose(units, ratio);

  const blocks: Block[] = [];
  let keptWords = 0;
  units.forEach((unit, index) => {
    const kept = unit.heading || chosen.has(index);
    if (kept) keptWords += unit.words;
    const kind = kept ? 'kept' : 'hidden';
    const last = blocks[blocks.length - 1];
    if (last && last.kind === kind) {
      last.text += unit.text;
      if (!kept) last.hiddenCount++;
    } else {
      blocks.push({ kind, text: unit.text, hiddenCount: kept ? 0 : 1 });
    }
  });

  return { blocks, keptWords, totalWords, shortened: true };
}