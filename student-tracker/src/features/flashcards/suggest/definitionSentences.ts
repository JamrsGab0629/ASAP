import { capitalizeFirst, cleanSentence, lowerArticle, wordCount } from './text';
import type { Generator, RawSuggestion } from './types';
import { isCutOff } from '../cardQuality';
const COPULA = /\b(is defined as|are defined as|refers to|refer to|means|is|are)\b/i;
const NOT_SUBJECTS = new Set([
  'it', 'this', 'that', 'these', 'those', 'they', 'there', 'he', 'she', 'we', 'you', 'i', 'which', 'who', 'what', 'here',
  'also', 'however', 'thus', 'so', 'then', 'each', 'every', 'many', 'some', 'most', 'all', 'both', 'one', 'another',
]);
const VERBY_SUBJECT = /\b(can|may|will|should|must|does|do|have|has|usually|often|also)\b/i;
const STARTS_LIKE_DEFINITION = /^(?:a|an|the|any|one|each|every)\b/i;

function questionFor(copula: string, subject: string): string {
  const s = lowerArticle(subject);
  const word = copula.toLowerCase();
  if (word === 'means') return `What does ${s} mean?`;
  if (word === 'refers to' || word === 'refer to') return `What does ${s} refer to?`;
  if (word === 'is defined as') return `How is ${s} defined?`;
  if (word === 'are defined as') return `How are ${s} defined?`;
  return `What ${word} ${s}?`;
}

/** Sentences like "An automaton is an abstract machine that…" become "What is an automaton?". */
export const definitionGenerator: Generator = {
  kind: 'definition',
  generate({ units }) {
    const found: RawSuggestion[] = [];
    units.forEach((unit, position) => {
      if (unit.heading) return;
      const sentence = cleanSentence(unit.text);
     if (sentence.includes('?') || isCutOff(sentence) || wordCount(sentence) < 6 || wordCount(sentence) > 40) return;

      const match = COPULA.exec(sentence);
      if (!match) return;
      const subject = sentence.slice(0, match.index).trim();
      const predicate = sentence.slice(match.index + match[0].length).trim().replace(/[.;]+$/, '');

      const subjectWords = wordCount(subject);
      if (subjectWords < 1 || subjectWords > 6) return;
      if (/[,:;]/.test(subject) || VERBY_SUBJECT.test(subject)) return;
      if (NOT_SUBJECTS.has(subject.split(/\s+/)[0].toLowerCase())) return;

      const copula = match[1].toLowerCase();
      const plain = copula === 'is' || copula === 'are';
      if (wordCount(predicate) < 3) return;
      if (plain && !STARTS_LIKE_DEFINITION.test(predicate)) return;

      found.push({ kind: 'definition', front: questionFor(copula, subject), back: capitalizeFirst(predicate), source: sentence, position });
    });
    return found;
  },
};