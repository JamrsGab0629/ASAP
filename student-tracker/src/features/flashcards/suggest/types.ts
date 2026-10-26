import type { Unit } from '@/features/shorten/types';

export type SuggestionKind = 'term' | 'definition' | 'list' | 'highlight' | 'blank';

/** A card the app thinks might be worth making. */
/** A card the app thinks might be worth making. */
export type Suggestion = {
  id: string;
  kind: SuggestionKind;
  front: string;
  back: string;
  /** The line or sentence it came from, used to avoid suggesting the same thing twice */
  source: string;
  /** The student highlighted this part of the note */
  highlighted: boolean;
  position: number;
  /** The model rewrote this card's front as a question */
  rewritten?: boolean;
};

export type RawSuggestion = Omit<Suggestion, 'id' | 'highlighted' | 'rewritten'>;

export type Context = {
  body: string;
  units: Unit[];
  highlights: string[];
  weights: Map<string, number>;
};

/** One way of finding cards. To add a new way, write one of these and add it to the list in suggestCards.ts. */
export interface Generator {
  kind: SuggestionKind;
  generate(context: Context): RawSuggestion[];
}