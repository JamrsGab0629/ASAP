/** Fronts that are labels, not questions: "Tip for exams", "Note", "Goals", "Overview", "Key points". */
const VAGUE_FRONT =
  /^(?:(?:exam\s+)?tips?|notes?|examples?|hints?|reminders?|summary|remember(?:\s+this)?|important|key\s+points?|key\s+takeaways?|misc(?:ellaneous)?|goals?|objectives?|outcomes?|overview|agenda|outline|introduction|conclusions?|references?|topics?|purpose)(?:\s+(?:for|on|about|of|to)\b.*)?[\s:.!-]*$/i;

/** Text that stops where a list was about to start: "The two goals are:", "(1) First. (2) Second. (3)". */
const CUT_OFF_END = /(?::|\(\d+\)|\b\d+\))\s*$/;

export const isVagueFront = (front: string) => VAGUE_FRONT.test(front.trim());
export const isCutOff = (text: string) => CUT_OFF_END.test(text.trim());

/** A card that can't make a fair question: its front is a label, or its answer stops halfway. */
export const isBrokenCard = (card: { front: string; back: string }) => isVagueFront(card.front) || isCutOff(card.back);