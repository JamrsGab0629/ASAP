import { unwrapLines } from '../cleanText';
import type { Section } from '../types';

export type PdfPage = { page: number; text: string };

/** Bullet glyphs that PowerPoint-style PDFs use, including private-use ones from Symbol and Wingdings. */
const BULLET = /^[\u2022\u25E6\u25AA\u25CF\u25A0\u25CB\u2023\u2043\u00B7\uF0B7\uF0A7\uF0D8\uF0FC\uF076\uF09F]\s*/;
const PAGE_NUMBER = /^(?:page\s+)?\d{1,3}(?:\s*(?:\/|of)\s*\d{1,3})?$/i;

function cleanLine(raw: string): string | null {
  const line = raw.replace(/[ \t\u00A0]+/g, ' ').trim();
  if (!line || PAGE_NUMBER.test(line)) return null;
  return BULLET.test(line) ? `- ${line.replace(BULLET, '')}` : line;
}

/** Raw page text -> tidy sections. Pages without text are left out. */
export function cleanPdfPages(pages: PdfPage[]): Section[] {
  const sections: Section[] = [];
  for (const { page, text } of pages) {
    const lines = text.split('\n').map(cleanLine).filter((l): l is string => l !== null);
    const body = unwrapLines(lines.join('\n')).trim();
    if (body) sections.push({ label: `Page ${page}`, text: body });
  }
  return sections;
}