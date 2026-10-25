import { stripBullet, wordCount, capitalizeFirst } from './text';
import type { Generator, RawSuggestion } from './types';

const HEADING = /^(?:Slide|Page) \d+/;
const TERM_LINE = /^([^:\n]{2,60}?):\s+(\S.*)$/;
const NOT_TERMS = new Set([
  'note', 'notes', 'example', 'examples', 'hint', 'tip', 'warning', 'source', 'sources', 'reference', 'references',
  'speaker notes', 'date', 'time', 'name', 'answer', 'question', 'objective', 'objectives', 'agenda', 'todo',
]);

/** "Term: definition" lines. The most reliable kind of card. */
export const termGenerator: Generator = {
  kind: 'term',
  generate({ body }) {
    const found: RawSuggestion[] = [];
    body.split('\n').forEach((raw, line) => {
      const text = stripBullet(raw).trim();
      if (!text || HEADING.test(text) || /https?:\/\//.test(text)) return;

      const match = TERM_LINE.exec(text);
      if (!match) return;
      const term = match[1].trim();
      const definition = match[2].trim();

      if (NOT_TERMS.has(term.toLowerCase()) || wordCount(term) > 8 || /^\d+$/.test(term)) return;
      if (wordCount(definition) < 3) return;
      found.push({ kind: 'term', front: term, back: capitalizeFirst(definition), source: text, position: line });
    });
    return found;
  },
};