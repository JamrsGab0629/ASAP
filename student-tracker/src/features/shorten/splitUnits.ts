import { splitSentences } from '@/lib/splitSentences';
import type { Unit } from './types';
import { countWords } from './words';

const HEADING = /^(?:Slide|Page) \d+\b/;
const SHORT_LIST_ITEM_WORDS = 4;

/** A tiny bullet like "- Input," that only makes sense next to its neighbours. */
const isShortListItem = (text: string, words: number) => /^\s*-\s/.test(text) && words <= SHORT_LIST_ITEM_WORDS;

/** Cuts a note into sentences and lines, remembering which slide or page each came from. */
export function splitUnits(body: string): Unit[] {
  const units: Unit[] = [];
  let section = 0;
  for (const text of splitSentences(body)) {
    const last = units[units.length - 1];
    if (text.trim() === '' && last) {
      last.text += text; // stray blank lines stay attached to the line before
      continue;
    }
    const heading = HEADING.test(text) || text.trim() === '';
    if (HEADING.test(text)) section++;
    const words = countWords(text);

    // Short list items are kept or hidden together, so a list never loses random items.
    const listItem = isShortListItem(text, words);
    if (last && last.list && last.section === section && listItem) {
      last.text += text;
      last.words += words;
      continue;
    }
    units.push({ text, section, heading, list: listItem, words });
  }
  return units;
}