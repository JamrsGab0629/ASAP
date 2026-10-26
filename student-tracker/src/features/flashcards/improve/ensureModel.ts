import { llamaImprover } from './llamaImprover';
import { downloadModel, isModelDownloaded } from './modelFiles';

/** Downloads the model if it isn't on the phone yet, then loads it into memory. */
export async function ensureModelReady(onDownloadPercent: (percent: number) => void): Promise<void> {
  if (!(await isModelDownloaded())) {
    onDownloadPercent(0);
    await downloadModel(onDownloadPercent);
  }
  await llamaImprover.load();
}