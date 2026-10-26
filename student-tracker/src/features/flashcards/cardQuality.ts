/** Fronts that are labels, not questions: "Tip for exams", "Note", "Examples of loops", "Key points". */
const VAGUE_FRONT =
  /^(?:(?:exam\s+)?tips?|notes?|examples?|hints?|reminders?|summary|remember(?:\s+this)?|important|key\s+points?|key\s+takeaways?|misc(?:ellaneous)?)(?:\s+(?:for|on|about|of|to)\b.*)?[\s:.!-]*$/i;

export const isVagueFront = (front: string) => VAGUE_FRONT.test(front.trim());