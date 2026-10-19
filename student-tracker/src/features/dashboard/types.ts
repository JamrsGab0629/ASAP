import type { SQLiteDatabase } from 'expo-sqlite';
import type { Href } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';

export type TileSummary = {
  text: string;
  attention?: boolean; // true = show in the warning color
};

/** One dashboard tile. Add a new module to the dashboard by writing one of these. */
export interface TileProvider {
  id: string;
  label: string;
  icon: LucideIcon;
  href: Href | null; // null = the screen isn't built yet, so the tile shows "Coming soon"
  load(db: SQLiteDatabase, today: Date): Promise<TileSummary>;
}

export type ResolvedTile = {
  provider: TileProvider;
  summary: TileSummary;
};