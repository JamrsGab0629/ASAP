import type { ComponentDraft, ItemDraft } from './types';

const toNumber = (text: string) => Number(text.trim().replace(',', '.'));

export type ComponentFields = { name: string; weight: string };
export type ItemFields = { title: string; score: string; maxScore: string };

export function parseComponent(
  subjectId: number,
  fields: ComponentFields,
  otherWeight: number,
): { draft: ComponentDraft } | { error: string } {
  const name = fields.name.trim();
  const weight = toNumber(fields.weight);
  if (!name) return { error: 'Give it a name.' };
  if (!(weight > 0 && weight <= 100)) return { error: 'Weight must be between 1 and 100.' };
  if (otherWeight + weight > 100.0001) {
    return { error: `Weights would add up to ${otherWeight + weight}%. Keep the total at 100% or less.` };
  }
  return { draft: { subjectId, name, weight } };
}

export function parseItem(componentId: number, fields: ItemFields): { draft: ItemDraft } | { error: string } {
  const title = fields.title.trim();
  const maxScore = toNumber(fields.maxScore);
  if (!title) return { error: 'Give it a title.' };
  if (!(maxScore > 0)) return { error: 'Out of must be more than 0.' };

  let score: number | null = null;
  if (fields.score.trim() !== '') {
    score = toNumber(fields.score);
    if (!Number.isFinite(score) || score < 0 || score > maxScore) {
      return { error: `Score must be between 0 and ${maxScore}.` };
    }
  }
  return { draft: { componentId, title, score, maxScore } };
}