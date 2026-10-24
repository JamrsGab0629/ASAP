/** One sentence or line of the note, in its original order. */
export type Unit = {
  text: string; // exactly as written, with its trailing spaces and line breaks
  section: number; // which slide or page it belongs to (0 before the first heading)
  heading: boolean; // "Slide 3 · Title" and "Page 4" lines
  list: boolean; // a run of tiny bullets, kept or hidden together
  words: number;
};

/** A run of the note that is either shown or hidden. */
export type Block = { kind: 'kept' | 'hidden'; text: string; hiddenCount: number };

export type ShortenResult = {
  blocks: Block[];
  keptWords: number;
  totalWords: number;
  /** false when the note is too short to shorten */
  shortened: boolean;
};

/** Decides which sentences to keep. Today that is the rule-based one in extractive.ts. */
export interface Shortener {
  /** Indexes of the units to keep, given how much of the text to keep (0 to 1). */
  choose(units: Unit[], ratio: number): Set<number>;
}