import { contentWords } from './words';
import type { Shortener, Unit } from './types';

export const BOILERPLATE = /all rights reserved|©|\(c\)\s*\d{4}|unauthorized use|for .{0,40}use only|strictly prohibited/i;
const DEFINITION_CUE = /\b(?:is|are|means|refers to|defined as|consists of|called|known as)\b/i;
const TERM_COLON = /^[-\s]*[^:\n]{2,40}:\s+\S/;

/** How much each word matters: how often it appears in the note, relative to the most common word. */
export function wordWeights(units: Unit[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const unit of units) {
    if (unit.heading) continue;
    for (const word of contentWords(unit.text)) counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  const max = Math.max(1, ...counts.values());
  return new Map([...counts].map(([word, count]) => [word, count / max]));
}

export function scoreUnit(unit: Unit, weights: Map<string, number>, isFirstInSection: boolean): number {
  const words = new Set(contentWords(unit.text));
  if (words.size === 0) return 0;

  let score = 0;
  for (const word of words) score += weights.get(word) ?? 0;
  score /= Math.sqrt(Math.max(words.size, 3)); // long sentences count more, but not endlessly more

  if (TERM_COLON.test(unit.text)) score += 1.2; // "Term: definition" is exactly what a student wants to keep
  else if (DEFINITION_CUE.test(unit.text)) score += 0.3;
  if (/\d/.test(unit.text)) score += 0.05;
  if (isFirstInSection) score *= 1.15;
  if (BOILERPLATE.test(unit.text)) score *= 0.1;
  return score;
}

export const extractiveShortener: Shortener = {
  choose(units, ratio) {
    const weights = wordWeights(units);
    const body = units.map((u, index) => ({ unit: u, index })).filter(({ unit }) => !unit.heading);
    const totalWords = body.reduce((sum, { unit }) => sum + unit.words, 0);
    const budget = Math.ceil(totalWords * ratio);

    const firstOfSection = new Set<number>();
    const seenSections = new Set<number>();
    for (const { unit, index } of body) {
      if (!seenSections.has(unit.section)) {
        seenSections.add(unit.section);
        firstOfSection.add(index);
      }
    }

    const ranked = body
      .map(({ unit, index }) => ({ index, unit, score: scoreUnit(unit, weights, firstOfSection.has(index)) }))
      .sort((a, b) => b.score - a.score || a.index - b.index);

    const chosen = new Set<number>();
    const seenText = new Set<string>();
    let kept = 0;
    const take = (index: number, unit: Unit) => {
      const key = unit.text.trim().toLowerCase();
      if (seenText.has(key)) return; // repeated line
      seenText.add(key);
      chosen.add(index);
      kept += unit.words;
    };

    // Every slide or page keeps its best line, so nothing disappears completely.
    const bestPerSection = new Map<number, (typeof ranked)[number]>();
    for (const item of ranked) if (!bestPerSection.has(item.unit.section) && item.score > 0) bestPerSection.set(item.unit.section, item);
    for (const { index, unit } of bestPerSection.values()) take(index, unit);

    for (const { index, unit, score } of ranked) {
      if (kept >= budget) break;
      if (score > 0 && !chosen.has(index)) take(index, unit);
    }
    return chosen;
  },
};