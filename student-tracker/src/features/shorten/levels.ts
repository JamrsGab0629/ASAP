export type LengthLevel = { key: string; label: string; hint: string; ratio: number };

/** The choices the student sees. To add a level, add a line. ratio 1 means "show everything". */
export const LENGTH_LEVELS: LengthLevel[] = [
  { key: 'original', label: 'Original', hint: 'Everything', ratio: 1 },
  { key: 'short', label: 'Short', hint: 'About half', ratio: 0.5 },
  { key: 'shortest', label: 'Shortest', hint: 'Key points only', ratio: 0.25 },
];