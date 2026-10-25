import { wordWeights } from '@/features/shorten/extractive';
import { splitUnits } from '@/features/shorten/splitUnits';
import { blankGenerator, highlightGenerator } from './blanks';
import { definitionGenerator } from './definitionSentences';
import { listGenerator } from './slideLists';
import { termGenerator } from './termLines';
import { normalize } from './text';
import type { Context, Generator, Suggestion, SuggestionKind } from './types';

/** Best kinds first. When two find the same sentence, the earlier one wins. To add a new way of finding cards, add it here. */
const GENERATORS: Generator[] = [termGenerator, definitionGenerator, listGenerator, highlightGenerator, blankGenerator];

const KIND_ORDER: Record<SuggestionKind, number> = { term: 0, definition: 1, list: 2, highlight: 3, blank: 4 };
const MAX_SUGGESTIONS = 40;

export type SuggestInput = {
  body: string;
  /** Text the student highlighted in this note */
  highlights: string[];
  /** Fronts of cards that already exist in this subject, so they are not suggested again */
  existingFronts: string[];
};

const touchesHighlight = (source: string, highlights: string[]) => {
  const s = normalize(source);
  return highlights.some((h) => {
    const n = normalize(h);
    return n.length >= 3 && (s.includes(n) || n.includes(s));
  });
};

/** Scans a note and returns cards worth considering: highlighted parts first, then by how reliable the kind is. */
export function suggestCards({ body, highlights, existingFronts }: SuggestInput): Suggestion[] {
  const units = splitUnits(body);
  const context: Context = { body, units, highlights, weights: wordWeights(units) };

  const existing = new Set(existingFronts.map(normalize));
  const seenSources = new Set<string>();
  const seenFronts = new Set<string>();
  const found: Omit<Suggestion, 'id'>[] = [];

  for (const generator of GENERATORS) {
    for (const raw of generator.generate(context)) {
      const sourceKey = normalize(raw.source);
      const frontKey = normalize(raw.front);
      if (seenSources.has(sourceKey) || seenFronts.has(frontKey) || existing.has(frontKey)) continue;
      seenSources.add(sourceKey);
      seenFronts.add(frontKey);
      found.push({ ...raw, highlighted: touchesHighlight(raw.source, highlights) });
    }
  }

  found.sort(
    (a, b) => Number(b.highlighted) - Number(a.highlighted) || KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || a.position - b.position,
  );
  return found.slice(0, MAX_SUGGESTIONS).map((s, i) => ({ ...s, id: `s${i}` }));
}