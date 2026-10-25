export const stripBullet = (line: string) => line.replace(/^\s*(?:[-•*]\s+)/, '');

/** A sentence as it should appear on a card: no bullet, no trailing spaces or line breaks. */
export const cleanSentence = (text: string) => stripBullet(text).trim();

export const capitalizeFirst = (text: string) => (text ? text[0].toUpperCase() + text.slice(1) : text);

/** "A finite automaton" -> "a finite automaton" (but "Algorithm" and "DFA" stay as they are). */
export const lowerArticle = (text: string) => text.replace(/^(A|An|The)\b/, (m) => m.toLowerCase());

export const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, ' ').trim();

export const wordCount = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

const SMALL_WORDS = new Set(['of', 'and', 'the', 'a', 'an', 'in', 'on', 'to', 'for', 'or', 'vs']);

/** "7 ELEMENTS OF PROGRAMMING" -> "7 Elements of Programming". Titles that already have lowercase are left alone. */
export function displayTitle(title: string): string {
  if (title !== title.toUpperCase()) return title;
  return title
    .toLowerCase()
    .split(' ')
    .map((word, i) => (i > 0 && SMALL_WORDS.has(word) ? word : capitalizeFirst(word)))
    .join(' ');
}