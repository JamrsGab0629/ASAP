export type PickedFile = { uri: string; name: string; size?: number };

/** One slide or one page of text. label is null for a plain text file. */
export type Section = { label: string | null; text: string };

export type ExtractionResult = {
  sections: Section[];
  unit?: 'slide' | 'page';
  note?: string; // shown to the student, e.g. "No text found"
};

export type Source = { uri: string; name: string; extension: string };

/** To support a new file type, write one of these and add it to the list in extractors.ts. */
export interface Extractor {
  extensions: string[];
  /** Largest file this extractor can handle, in bytes. Falls back to the importer's default. */
  maxBytes?: number;
  extract(source: Source): Promise<ExtractionResult>;
}