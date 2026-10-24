/** Splits text into sentences and lines. Each piece keeps its trailing spaces and line breaks, so joining them rebuilds the text exactly. */
export function splitSentences(text: string): string[] {
  const pieces: string[] = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const endsSentence = ch === '\n' || ('.!?'.includes(ch) && (i + 1 === text.length || /\s/.test(text[i + 1])));
    if (!endsSentence) continue;

    let end = i + 1;
    while (end < text.length && /\s/.test(text[end])) end++;
    pieces.push(text.slice(start, end));
    start = end;
    i = end - 1;
  }
  if (start < text.length) pieces.push(text.slice(start));
  return pieces;
}