import type { Section } from './types';

/** Zip entry path -> its XML text, only for the entries this parser needs. */
export type PptxFiles = Record<string, string>;

const ENTITIES: Record<string, string> = { '&lt;': '<', '&gt;': '>', '&amp;': '&', '&quot;': '"', '&apos;': "'" };

const decodeXml = (text: string) =>
  text.replace(/&(?:lt|gt|amp|quot|apos);|&#(\d+);|&#x([0-9a-fA-F]+);/g, (m, dec, hex) =>
    dec ? String.fromCodePoint(Number(dec)) : hex ? String.fromCodePoint(parseInt(hex, 16)) : ENTITIES[m],
  );

function matches(pattern: RegExp, text: string): RegExpExecArray[] {
  const found: RegExpExecArray[] = [];
  const re = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
  let match = re.exec(text);
  while (match) {
    found.push(match);
    match = re.exec(text);
  }
  return found;
}

const attr = (tag: string, name: string) => new RegExp(`${name}="([^"]*)"`).exec(tag)?.[1];

type Paragraph = { text: string; level: number };
type ShapeKind = 'title' | 'body' | 'other' | 'skip';
type Shape = { kind: ShapeKind; paragraphs: Paragraph[] };

function paragraphsOf(xml: string): Paragraph[] {
  return matches(/<a:p[ >][\s\S]*?<\/a:p>/, xml)
    .map((m) => {
      const parts = matches(/<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>|<a:br\s*\/>/, m[0]);
      const text = decodeXml(parts.map((p) => p[1] ?? '\n').join('')).trim();
      const level = Number(/<a:pPr[^>]*\blvl="(\d+)"/.exec(m[0])?.[1] ?? 0);
      return { text, level };
    })
    .filter((p) => p.text !== '');
}

function shapesOf(xml: string): Shape[] {
  return matches(/<p:(sp|graphicFrame)[ >][\s\S]*?<\/p:\1>/, xml).map((m) => {
    const placeholder = /<p:ph\b([^>]*)>/.exec(m[0]);
    const type = placeholder ? attr(placeholder[1], 'type') : undefined;
    let kind: ShapeKind = 'other';
    if (type === 'title' || type === 'ctrTitle') kind = 'title';
    else if (type && ['ftr', 'dt', 'sldNum', 'hdr', 'sldImg'].includes(type)) kind = 'skip';
    else if (placeholder) kind = 'body';
    return { kind, paragraphs: paragraphsOf(m[0]) };
  });
}

const bullet = (p: Paragraph) => `${'  '.repeat(p.level)}- ${p.text}`;

function parseSlide(xml: string): { title: string; lines: string[] } {
  const title: string[] = [];
  const lines: string[] = [];
  for (const shape of shapesOf(xml)) {
    if (shape.kind === 'skip') continue;
    if (shape.kind === 'title') title.push(...shape.paragraphs.map((p) => p.text));
    else if (shape.kind === 'body') lines.push(...shape.paragraphs.map(bullet));
    else lines.push(...shape.paragraphs.map((p) => p.text));
  }
  return { title: title.join(' '), lines };
}

function parseNotes(xml: string): string {
  return shapesOf(xml)
    .filter((s) => s.kind === 'body')
    .flatMap((s) => s.paragraphs.map((p) => p.text))
    .join('\n');
}

const slideNumber = (path: string) => Number(/slide(\d+)\.xml$/.exec(path)?.[1] ?? 0);

/** Slide paths in the order they appear in the presentation, which can differ from their file numbers. */
function slidePathsInOrder(files: PptxFiles): string[] {
  const allSlides = Object.keys(files).filter((p) => /^ppt\/slides\/slide\d+\.xml$/.test(p));
  const presentation = files['ppt/presentation.xml'];
  const relationships = files['ppt/_rels/presentation.xml.rels'];

  if (presentation && relationships) {
    const targets = new Map<string, string>();
    for (const m of matches(/<Relationship\b[^>]*>/, relationships)) {
      const id = attr(m[0], 'Id');
      const target = attr(m[0], 'Target');
      if (id && target) targets.set(id, target);
    }
    const ordered = matches(/<p:sldId\b[^>]*>/, presentation)
      .map((m) => targets.get(attr(m[0], 'r:id') ?? ''))
      .filter((t): t is string => Boolean(t))
      .map((t) => `ppt/${t.replace(/^\/?(ppt\/)?/, '')}`)
      .filter((p) => p in files);
    if (ordered.length > 0) return ordered;
  }
  return allSlides.sort((a, b) => slideNumber(a) - slideNumber(b));
}

function notesFor(slidePath: string, files: PptxFiles): string {
  const rels = files[slidePath.replace('slides/', 'slides/_rels/') + '.rels'];
  const target = rels && /Target="[^"]*notesSlides\/([^"]+)"/.exec(rels)?.[1];
  const notes = target ? files[`ppt/notesSlides/${target}`] : undefined;
  return notes ? parseNotes(notes) : '';
}

export function parsePptx(files: PptxFiles): Section[] {
  const sections: Section[] = [];
  slidePathsInOrder(files).forEach((path, index) => {
    const { title, lines } = parseSlide(files[path]);
    const notes = notesFor(path, files);
    const body = [...lines, ...(notes ? ['', 'Speaker notes:', notes] : [])].join('\n').trim();
    if (!title && !body) return; // a slide with only pictures
    sections.push({ label: `Slide ${index + 1}${title ? ` · ${title}` : ''}`, text: body });
  });
  return sections;
}