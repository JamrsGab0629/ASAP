

import { displayTitle, wordCount } from './text';
import type { Generator, RawSuggestion } from './types';

const HEADING = /^(?:Slide|Page) \d+(?:\s·\s(.+))?$/;
const BULLET = /^-\s+(.+)$/;
const GENERIC_TITLES = new Set([
  'contents', 'agenda', 'outline', 'objectives', 'learning objectives', 'overview', 'references', 'thank you',
  'questions', 'summary', 'introduction', 'topics', 'recap',
]);
const MIN_ITEMS = 3;
const MAX_ITEMS = 12;
const MAX_ITEM_WORDS = 7;

type Section = { title: string | null; items: string[]; line: number; valid: boolean };

/** A slide with a title and a short list of bullets becomes "List: <title>". */
export const listGenerator: Generator = {
  kind: 'list',
  generate({ body }) {
    const found: RawSuggestion[] = [];
    let section: Section = { title: null, items: [], line: 0, valid: false };

    const finish = () => {
      const { title, items, line, valid } = section;
      if (!valid || !title || GENERIC_TITLES.has(title.toLowerCase())) return;
      if (items.length < MIN_ITEMS || items.length > MAX_ITEMS) return;
      if (items.filter((i) => /:\s/.test(i)).length * 2 > items.length) return; // a list of definitions, handled elsewhere
      found.push({
        kind: 'list',
        front: `List: ${displayTitle(title)}`,
        back: items.map((i) => `• ${i}`).join('\n'),
        source: `${title}|${items.join('|')}`,
        position: line,
      });
    };

    body.split('\n').forEach((raw, line) => {
      const text = raw.trim();
      if (!text) return;

      const heading = HEADING.exec(text);
      if (heading) {
        finish();
        section = { title: heading[1]?.trim() ?? null, items: [], line, valid: true };
        return;
      }
      const bullet = BULLET.exec(text);
      const nested = /^\s+-\s/.test(raw);
      const item = bullet?.[1].replace(/[,;.]+$/, '').trim();
      if (!bullet || nested || !item || wordCount(item) > MAX_ITEM_WORDS) {
        section.valid = false; // paragraphs, nested bullets and long bullets are not a simple list
        return;
      }
      section.items.push(item);
    });
    finish();
    return found;
  },
};