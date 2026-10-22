import JSZip from 'jszip';
import { readBase64, readText } from './fileAccess';
import { normalizeText, removeRepeatedLines, unwrapLines } from './cleanText';
import { parsePptx, type PptxFiles } from './pptxParser';
import type { ExtractionResult, Extractor, Source } from './types';

const textExtractor: Extractor = {
  extensions: ['.txt', '.md', '.markdown'],
  async extract({ uri, extension }: Source): Promise<ExtractionResult> {
   const cleaned = normalizeText(await readText(uri));  
    const text = extension === '.txt' ? unwrapLines(cleaned) : cleaned; // Markdown keeps its own line breaks
    return { sections: text ? [{ label: null, text }] : [] };
  },
};

const PPTX_ENTRIES =
  /^ppt\/(presentation\.xml|_rels\/presentation\.xml\.rels|slides\/slide\d+\.xml|slides\/_rels\/slide\d+\.xml\.rels|notesSlides\/notesSlide\d+\.xml)$/;

  
const pptxExtractor: Extractor = {
  extensions: ['.pptx'],
  async extract({ uri }: Source): Promise<ExtractionResult> {
  const zip = await JSZip.loadAsync(await readBase64(uri), { base64: true });
    const files: PptxFiles = {};
    await Promise.all(
      Object.keys(zip.files)
        .filter((name) => PPTX_ENTRIES.test(name))
        .map(async (name) => {
          files[name] = await zip.files[name].async('string');
        }),
    );
    const sections = removeRepeatedLines(parsePptx(files));
    return {
      sections,
      unit: 'slide',
      note: sections.length === 0 ? 'No text found. The slides may be pictures. The file is saved so you can open it.' : undefined,
    };
  },
};

/** PDFs are stored as attachments for now. Swap this for a real text extractor later. */
const pdfExtractor: Extractor = {
  extensions: ['.pdf'],
  async extract(): Promise<ExtractionResult> {
    return { sections: [], unit: 'page', note: 'Saved as a file. Reading text out of PDFs comes later.' };
  },
};

export const EXTRACTORS: Extractor[] = [textExtractor, pptxExtractor, pdfExtractor];

export const findExtractor = (extension: string) => EXTRACTORS.find((e) => e.extensions.includes(extension)) ?? null;
export const supportedExtensions = () => EXTRACTORS.flatMap((e) => e.extensions);