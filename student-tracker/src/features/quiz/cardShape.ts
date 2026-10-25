import type { QuizCard } from './types';

/** The blank marker used by the card scanner's fill-in-the-blank cards. */
export const BLANK_MARK = '_____';
export const MAX_ANSWER_CHARS = 160;

const words = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

/** "List: Types of Automata" with "• item" lines. */
export const isList = (card: QuizCard) =>
  card.front.startsWith('List: ') && card.back.split('\n').every((line) => line.startsWith('• '));

export const listItems = (card: QuizCard) =>
  card.back.split('\n').map((line) => line.replace(/^•\s*/, '').trim()).filter(Boolean);

export const listTitle = (card: QuizCard) => card.front.replace(/^List:\s*/, '').trim();

/** A sentence with a hidden word. The back starts with that word, then a blank line, then the full sentence. */
export const isBlank = (card: QuizCard) => card.front.includes(BLANK_MARK) && card.back.includes('\n\n');

export const blankAnswer = (card: QuizCard) => card.back.split('\n')[0].trim();

/** The short answer a card stands for. */
export const answerText = (card: QuizCard) => (isBlank(card) ? blankAnswer(card) : card.back.trim());

const MAX_TERM_WORDS = 5;
const INTERROGATIVE = /^(?:what|who|whom|when|where|why|how|which)\b/i;
const LEADING_ARTICLE = /^(?:an?|the)\s+/i;
/** Words that show the "term" is really a longer question, such as "What is the purpose of a loop?" */
const NOT_A_TERM = /\b(?:used|for|of|in|to|between|difference|purpose|examples?|advantages?|disadvantages?|types?)\b/i;

/** Ways a front asks about a term. The first group of each pattern is the term. */
const TERM_PATTERNS: RegExp[] = [
  /^(?:what|who)\s+(?:is|are|was|were)\s+(.+?)\s*\??$/i, // What is assembly / Who are the Spartans?
  /^what\s+does\s+(.+?)\s+(?:mean|refer to|stand for)\s*\??$/i, // What does DFA stand for?
  /^(?:define|describe|explain|identify|meaning of|definition of|give the meaning of|give the definition of)\s*:?\s+(.+?)\s*[.?]?$/i, // Define loop
];

const isTermLike = (term: string) => words(term) >= 1 && words(term) <= MAX_TERM_WORDS && !NOT_A_TERM.test(term);

/** Cards that name a thing and describe it: "Alphabet" / "A finite set…", or "What is X" / "…". */
export function termSide(card: QuizCard): { term: string; description: string } | null {
  if (isList(card) || isBlank(card)) return null;
  const front = card.front.trim();
  const description = card.back.trim();

  for (const pattern of TERM_PATTERNS) {
    const match = pattern.exec(front);
    if (!match) continue;
    const term = match[1].trim().replace(LEADING_ARTICLE, '');
    return isTermLike(term) ? { term, description } : null;
  }

  if (!INTERROGATIVE.test(front) && !front.includes('?') && words(front) <= MAX_TERM_WORDS && words(description) > words(front)) {
    return { term: front, description };
  }
  return null;
}

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Hides the answer inside a prompt, including its plural or singular form, so the question doesn't give it away. */
export function hideAnswer(text: string, answer: string): string {
  const base = answer.trim().replace(LEADING_ARTICLE, '');
  const stem = base.length > 3 && /[^s]s$/i.test(base) ? base.slice(0, -1) : base;
  if (stem.length < 3) return text;
  return text.replace(new RegExp(`\\b${escapeRegExp(stem)}(?:s|es)?\\b`, 'gi'), BLANK_MARK);
}

export const wordCount = words;