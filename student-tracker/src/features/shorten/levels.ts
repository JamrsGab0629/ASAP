export type LengthLevel = {
  key: string;
  label: string;
  hint: string;
  ratio: number;
  /** true when the kept sentences can also be reworded by the on-device model */
  ai?: boolean;
};

/** The choices the student sees. To add a level, add a line. ratio 1 means "show everything". */
export const LENGTH_LEVELS: LengthLevel[] = [
  { key: 'original', label: 'Original', hint: 'Everything', ratio: 1 },
  { key: 'short', label: 'Short', hint: 'About half', ratio: 0.55 },
  { key: 'shortest', label: 'Shortest', hint: 'Key points only', ratio: 0.3 },
  { key: 'tighter', label: 'Tighter', hint: 'Short + AI', ratio: 0.55, ai: true },
];