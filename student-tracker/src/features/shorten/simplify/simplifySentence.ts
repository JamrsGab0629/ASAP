import { cleanSimple } from './clean';

/** Something that can shorten a sentence. The real one is the on-device model. A fake one is used in tests. */
export interface Simplifier {
  /** Returns the raw text the model wrote. It is checked before the student sees it. */
  write(sentence: string): Promise<string>;
}

/** The shortened sentence, or the original when the model's answer did not pass the checks. */
export async function simplifySentence(simplifier: Simplifier, sentence: string): Promise<string> {
  const original = sentence.trim();
  return cleanSimple(original, await simplifier.write(original)) ?? original;
}