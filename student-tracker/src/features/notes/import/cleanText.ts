import type { Section } from './types';

/** Newlines, trailing spaces and runs of blank lines. */
export function normalizeText(raw: string): string {
  return raw
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Joins lines that were broken in the middle of a sentence, which is common in text copied
 * from PDFs: a long line that doesn't end a sentence, followed by a lowercase line.
 */
export function unwrapLines(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  for (const line of lines) {
    const previous = result[result.length - 1];
    const continues =
      previous !== undefined &&
      previous.trim().length > 40 &&
      !/[.:;!?)\]"”]$/.test(previous.trim()) &&
      /^[a-z]/.test(line.trim());
    if (!continues) {
      result.push(line);
    } else if (previous.endsWith('-') && !previous.endsWith(' -')) {
      result[result.length - 1] = previous.slice(0, -1) + line.trim(); // "exam-" + "ple" -> "example"
    } else {
      result[result.length - 1] = `${previous} ${line.trim()}`;
    }
  }
  return result.join('\n');
}

/** Drops plain lines that repeat on most slides or pages (footers, course names). */
export function removeRepeatedLines(sections: Section[]): Section[] {
  if (sections.length < 4) return sections;
  const threshold = Math.max(3, Math.ceil(sections.length * 0.5));

  const counts = new Map<string, number>();
  for (const section of sections) {
    for (const line of new Set(section.text.split('\n').map((l) => l.trim()))) {
      if (line) counts.set(line, (counts.get(line) ?? 0) + 1);
    }
  }
  const isRepeated = (line: string) =>
    !line.trimStart().startsWith('- ') && line.trim().length < 80 && (counts.get(line.trim()) ?? 0) >= threshold;

  return sections.map((s) => ({ ...s, text: s.text.split('\n').filter((l) => !isRepeated(l)).join('\n').trim() }));
}

export function composeBody(sections: Section[]): string {
  return sections
    .map((s) => (s.label ? `${s.label}\n${s.text}`.trim() : s.text))
    .join('\n\n')
    .trim();
}

export const countWords = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);