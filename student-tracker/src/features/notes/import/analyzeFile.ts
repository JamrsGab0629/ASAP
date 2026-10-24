import { composeBody, countWords } from './cleanText';
import { findExtractor, supportedExtensions } from './extractors';
import type { PickedFile } from './types';

export type FileAnalysis =
  | {
      status: 'ready';
      file: PickedFile;
      title: string;
      body: string;
      unit: 'slide' | 'page' | null;
      sectionCount: number;
      wordCount: number;
      note?: string;
    }
  | { status: 'unsupported' | 'failed'; name: string; message: string };

const MAX_BYTES = 40 * 1024 * 1024;

const extensionOf = (name: string) => (/\.[^.]+$/.exec(name)?.[0] ?? '').toLowerCase();
const titleFromName = (name: string) => name.replace(/\.[^.]+$/, '').replace(/[_]+/g, ' ').trim() || name;

/** Reads one picked file and says what would be imported. Never throws. */
export async function analyzeFile(file: PickedFile): Promise<FileAnalysis> {
  const extension = extensionOf(file.name);
  const extractor = findExtractor(extension);
  if (!extractor) {
    return {
      status: 'unsupported',
      name: file.name,
      message: `${extension || 'This kind of'} file can't be imported. Supported: ${supportedExtensions().join(', ')}.`,
    };
  }
    const limit = extractor.maxBytes ?? MAX_BYTES;
  if (file.size && file.size > limit) {
    return {
      status: 'failed',
      name: file.name,
      message: `Too large to read on the phone (over ${Math.round(limit / 1024 / 1024)} MB).`,
    };
  }
  try {
    const result = await extractor.extract({ uri: file.uri, name: file.name, extension });
    const body = composeBody(result.sections);
    if (!body && !result.note) return { status: 'failed', name: file.name, message: 'No text was found in this file.' };
    return {
      status: 'ready',
      file,
      title: titleFromName(file.name),
      body,
      unit: result.unit ?? null,
      sectionCount: result.sections.length,
      wordCount: countWords(body),
      note: result.note,
    };
    } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { status: 'failed', name: file.name, message: `Couldn't read this file: ${reason}` };
  }
}