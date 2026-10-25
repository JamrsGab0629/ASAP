const PUNCTUATION = /[.,;:!?'"()[\]{}\-_/\\]/g;
const LEADING_ARTICLE = /^(?:a|an|the)\s+/;

/** Lowercase, no punctuation, no extra spaces, no leading "a/an/the". */
export const normalizeAnswer = (text: string) =>
  text.toLowerCase().replace(PUNCTUATION, ' ').replace(/\s+/g, ' ').trim().replace(LEADING_ARTICLE, '');

/** "loops" -> "loop", "classes" -> "class", "entries" -> "entry". Short words are left alone. */
function singular(word: string): string {
  if (word.length <= 3) return word;
  if (word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (/(?:sses|ches|shes|xes)$/.test(word)) return word.slice(0, -2);
  if (word.endsWith('ss')) return word;
  return word.endsWith('s') ? word.slice(0, -1) : word;
}

const withSingularWords = (text: string) => text.split(' ').map(singular).join(' ');

export function editDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return row[b.length];
}

/** True when the typed answer is the expected one, forgiving capitals, punctuation and a small typo in longer answers. */
export function sameAnswer(expected: string, given: string): boolean {
  const a = normalizeAnswer(expected);
  const b = normalizeAnswer(given);
  if (!b) return false;
  if (a === b || withSingularWords(a) === withSingularWords(b)) return true;
  const allowed = a.length >= 12 ? 2 : a.length >= 6 ? 1 : 0;
  return allowed > 0 && editDistance(a, b) <= allowed;
}