import { contentWords, countWords, wordsOf } from '../words';

const MIN_WORDS = 8; // shorter sentences are already short
const MAX_WORDS = 60; // longer ones are usually a pasted paragraph, and the small model loses track
const MIN_KEEP_SHARE = 0.4; // the rewrite must keep at least this share of the original's length
const MAX_SIZE_SHARE = 0.9; // and must be at least this much shorter
const MIN_KEY_WORDS_KEPT = 0.5;

const HEADING = /^(?:Slide|Page)\s+\d+\b/;
const LABEL = /^(?:simplified|shorter|short|rewritten|rewrite|sentence|output|answer)(?:\s+(?:sentence|version))?\s*:\s*/i;
const NUMBER = /\d+(?:[.,]\d+)*/g;

/** Only sentences of a sensible size are worth sending to the model. */
export function canSimplify(sentence: string): boolean {
  if (HEADING.test(sentence.trim())) return false;
  const words = countWords(sentence);
  return words >= MIN_WORDS && words <= MAX_WORDS;
}

const related = (a: string, b: string) => {
  if (a === b) return true;
  const short = Math.min(a.length, b.length);
  if (short >= 3 && (a.startsWith(b) || b.startsWith(a))) return true; // use / used
  let i = 0;
  while (i < short && a[i] === b[i]) i++;
  return i >= 5; // organize / organization
};

const numbersOf = (text: string) => new Set(text.match(NUMBER) ?? []);
const sameSet = (a: Set<string>, b: Set<string>) => a.size === b.size && [...a].every((x) => b.has(x));

/**
 * Checks what the model wrote. Returns the cleaned sentence, or null when it should not be used.
 * A rewrite may only drop and tighten words: it must be shorter, keep every number and most key terms,
 * and not bring in words that were never in the sentence.
 */
export function cleanSimple(original: string, output: string): string | null {
  const source = original.trim();
  const line = output.split('\n').map((l) => l.trim()).find((l) => l.length > 0) ?? '';
  let text = line
    .replace(/^[-•*]\s+/, '')
    .replace(/^\d+[.)]\s+/, '')
    .replace(LABEL, '')
    .replace(/^["“‘']+|["”’']+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return null;
  if (/[.!?]$/.test(source) && !/[.!?]$/.test(text)) text += source.slice(-1);

  if (wordsOf(text).join(' ') === wordsOf(source).join(' ')) return null; // nothing changed

  const before = countWords(source);
  const after = countWords(text);
  if (after > Math.floor(before * MAX_SIZE_SHARE)) return null;
  if (after < Math.ceil(before * MIN_KEEP_SHARE)) return null;
  if (!sameSet(numbersOf(source), numbersOf(text))) return null;

  const sourceKeys = [...new Set(contentWords(source))];
  const textKeys = [...new Set(contentWords(text))];
  const invented = textKeys.filter((w) => !sourceKeys.some((s) => related(s, w))).length;
  if (invented > Math.floor(sourceKeys.length / 8)) return null;
  const kept = sourceKeys.filter((s) => textKeys.some((w) => related(s, w))).length;
  if (sourceKeys.length > 0 && kept / sourceKeys.length < MIN_KEY_WORDS_KEPT) return null;

  return text;
}