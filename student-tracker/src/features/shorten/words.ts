const STOP_WORDS = new Set(
  (
    'a an and are as at be been being but by can could did do does for from had has have he her his how i if in into is it its ' +
    'may might more most no not of on or our out over she should so some such than that the their them then there these they ' +
    'this those to too under up us was we were what when where which while who why will with would you your also about after ' +
    'all any because both each few other only own same very just then than ' +
    'ang ng sa na at ay mga ito ang si ni kay para sa mga ako ikaw siya kami tayo kayo sila'
  ).split(' '),
);

const WORD = /[a-z0-9\u00C0-\u024F][a-z0-9\u00C0-\u024F'-]*/g;

export const wordsOf = (text: string): string[] => text.toLowerCase().match(WORD) ?? [];

/** Words that carry meaning: not filler, not just a number. */
export const contentWords = (text: string): string[] =>
  wordsOf(text).filter((w) => w.length > 2 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));

export const countWords = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);
/** Every word in the text with where it starts, keeping its original capitals. */
export function wordMatches(text: string): { word: string; index: number }[] {
  const found: { word: string; index: number }[] = [];
  const pattern = new RegExp(WORD.source, 'gi');
  let match = pattern.exec(text);
  while (match) {
    found.push({ word: match[0], index: match.index });
    match = pattern.exec(text);
  }
  return found;
}

/** True when two words are the same word in a different form: use / used, translate / translated, organize / organization. */
export const related = (a: string, b: string): boolean => {
  if (a === b) return true;
  const short = Math.min(a.length, b.length);
  if (short >= 3 && (a.startsWith(b) || b.startsWith(a))) return true;
  let i = 0;
  while (i < short && a[i] === b[i]) i++;
  return i >= 5;
};