import type { PdfPage } from './cleanPdfText';

/** Something that can read a PDF. The hidden web page registers itself as one. */
export interface PdfHost {
  extract(base64: string): Promise<PdfPage[]>;
}

const START_TIMEOUT_MS = 10_000;
const POLL_MS = 50;

let current: PdfHost | null = null;

export function registerPdfHost(host: PdfHost): () => void {
  current = host;
  return () => {
    if (current === host) current = null;
  };
}

/** The reader mounts a moment after the import starts, so wait briefly for it. */
async function waitForHost(): Promise<PdfHost> {
  const deadline = Date.now() + START_TIMEOUT_MS;
  for (;;) {
    const host = current;
    if (host) return host;
    if (Date.now() > deadline) throw new Error("The PDF reader didn't start.");
    await new Promise<void>((resolve) => setTimeout(resolve, POLL_MS));
  }
}

export async function extractPdfPages(base64: string): Promise<PdfPage[]> {
  return (await waitForHost()).extract(base64);
}