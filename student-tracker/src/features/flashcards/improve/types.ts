export type ImproveInput = {
  /** The card's current front, which is vague or unclear */
  front: string;
  /** The card's back, which holds the answer */
  back: string;
  /** The part of the note the card came from */
  context: string;
};

/** Something that can write a better front for a card. The real one is a small on-device model. A fake one is used in tests. */
export interface CardImprover {
  /** Returns the raw text the model wrote. It is checked before the student sees it. */
  write(input: ImproveInput): Promise<string>;
}

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };