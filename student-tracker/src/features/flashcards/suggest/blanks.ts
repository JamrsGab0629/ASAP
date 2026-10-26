import { BOILERPLATE, scoreUnit } from '@/features/shorten/extractive';
import { contentWords, wordMatches } from '@/features/shorten/words';
import { cleanSentence, wordCount } from './text';
import type { Context, Generator, RawSuggestion } from './types';
import { isCutOff } from '../cardQuality';
export const BLANK = '_____';
const MIN_WORDS = 6;
const MAX_WORDS = 35;
const MAX_ANSWER_WORDS = 8;
const MAX_RANKED_CARDS = 8;
const FILLER = /^(?:thank|thanks|any questions|questions\?|it |this |that |they |these |those |he |she |we |there )/i;
const TERM_COLON = /^[^:\n]{2,40}:\s+\S/;

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** The word that matters most in the sentence: frequent in the note, and long enough to be a real term. */
function chooseAnswer(sentence: string, weights: Map<string, number>): string | null {
  let best: { word: string; score: number } | null = null;
  for (const { word } of wordMatches(sentence)) {
    const lower = word.toLowerCase();
    if (word.length < 5 || contentWords(lower).length === 0) continue;
    const score = (weights.get(lower) ?? 0) + word.length / 100;
    if (!best || score > best.score) best = { word, score };
  }
  return best?.word ?? null;
}

/** A card with the answer hidden in the sentence. Every copy of the answer is hidden, so it can't leak. */
function makeBlank(sentence: string, answer: string): { front: string; back: string } | null {
  const hidden = new RegExp(escapeRegExp(answer), 'gi');
  if (!hidden.test(sentence)) return null;
  const front = sentence.replace(new RegExp(escapeRegExp(answer), 'gi'), BLANK);
  return { front, back: `${answer}\n\n${sentence}` };
}

const eligible = (sentence: string) => {
  const words = wordCount(sentence);
  return words >= MIN_WORDS && words <= MAX_WORDS && !sentence.includes('?') && !BOILERPLATE.test(sentence) && !FILLER.test(sentence) && !isCutOff(sentence);
};

/** Cards from what the student highlighted. A highlighted phrase becomes the hidden answer. */
export const highlightGenerator: Generator = {
  kind: 'highlight',
  generate({ units, highlights, weights }) {
    const found: RawSuggestion[] = [];
    for (const raw of highlights) {
      const phrase = raw.trim();
      const position = units.findIndex((u) => !u.heading && u.text.includes(phrase));
      if (position === -1) continue;

      const sentence = cleanSentence(units[position].text);
      if (!eligible(sentence)) continue;

      const wholeSentence = phrase.length >= sentence.length * 0.8 || wordCount(phrase) > MAX_ANSWER_WORDS;
      const answer = wholeSentence ? chooseAnswer(sentence, weights) : phrase;
      const card = answer ? makeBlank(sentence, answer) : null;
      if (card) found.push({ kind: 'highlight', ...card, source: sentence, position });
    }
    return found;
  },
};

/** Fill-in-the-blank cards from the note's most important sentences. Lowest confidence, so they come last. */
export const blankGenerator: Generator = {
  kind: 'blank',
  generate(context: Context) {
    const { units, weights } = context;
    const ranked = units
      .map((unit, position) => ({ unit, position, sentence: cleanSentence(unit.text) }))
      .filter(({ unit, sentence }) => !unit.heading && !unit.list && eligible(sentence) && !TERM_COLON.test(sentence))
      .map((item) => ({ ...item, score: scoreUnit(item.unit, weights, false) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RANKED_CARDS);

    const found: RawSuggestion[] = [];
    for (const { sentence, position } of ranked) {
      const answer = chooseAnswer(sentence, weights);
      const card = answer ? makeBlank(sentence, answer) : null;
      if (card) found.push({ kind: 'blank', ...card, source: sentence, position });
    }
    return found;
  },
};