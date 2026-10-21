/** #hashtags in the text, lowercase and without the '#'. */
export function extractTags(text: string): string[] {
  const found = new Set<string>();
  const pattern = /(^|\s)#([A-Za-z0-9_-]+)/g;
  let match = pattern.exec(text);
  while (match) {
    found.add(match[2].toLowerCase());
    match = pattern.exec(text);
  }
  return [...found];
}