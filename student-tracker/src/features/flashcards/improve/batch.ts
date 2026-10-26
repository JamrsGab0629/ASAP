export type Progress = { done: number; total: number };

/** Runs the work on one item at a time (the model can only do one thing at once), reports progress, and stops early when cancelled. */
export async function runSequentially<T, R>(
  items: T[],
  work: (item: T) => Promise<R>,
  onProgress: (progress: Progress) => void,
  isCancelled: () => boolean,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i++) {
    if (isCancelled()) break;
    results.push(await work(items[i]));
    onProgress({ done: i + 1, total: items.length });
  }
  return results;
}