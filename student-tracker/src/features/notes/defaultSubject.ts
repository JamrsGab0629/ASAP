type Input = {
  filterSubjectId: number | null;
  ongoingSubjectId: number | null;
  lastUsedId: number | null;
  subjectIds: number[];
};

/** Which subject a new note starts in. The first valid candidate wins. */
export function pickDefaultSubject({ filterSubjectId, ongoingSubjectId, lastUsedId, subjectIds }: Input): number | null {
  const valid = new Set(subjectIds);
  for (const candidate of [filterSubjectId, ongoingSubjectId, lastUsedId]) {
    if (candidate !== null && valid.has(candidate)) return candidate;
  }
  return subjectIds[0] ?? null;
}