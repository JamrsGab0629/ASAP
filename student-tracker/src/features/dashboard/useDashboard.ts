import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import type { SQLiteDatabase } from 'expo-sqlite';
import { countOpenDueOnOrBefore, getUpcomingDeadlines } from '@/features/deadlines/upcomingDeadlines';
import type { DueDeadline } from '@/features/deadlines/upcomingDeadlines';
import { getClassesForDate } from '@/features/schedule/classesForDate';
import { pickNextClass } from '@/features/schedule/nextClass';
import type { NextClass } from '@/features/schedule/nextClass';
import { toISODate } from '@/lib/dates';
import { buildHeadline } from './headline';
import { tileProviders } from './tiles';
import type { ResolvedTile, TileProvider, TileSummary } from './types';

export type DashboardData = {
  headline: string;
  nextClass: NextClass | null;
  tiles: ResolvedTile[];
  deadlines: DueDeadline[];
};

const FALLBACK_SUMMARY: TileSummary = { text: '—' };

// One broken tile must not break the whole dashboard.
function loadSummary(provider: TileProvider, db: SQLiteDatabase, now: Date): Promise<TileSummary> {
  return provider.load(db, now).catch(() => FALLBACK_SUMMARY);
}

export function useDashboard(providers: TileProvider[] = tileProviders): DashboardData | null {
  const db = useSQLiteContext();
  const [data, setData] = useState<DashboardData | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function load() {
        const now = new Date();
        const [classes, deadlines, dueCount, summaries] = await Promise.all([
          getClassesForDate(db, now),
          getUpcomingDeadlines(db, now),
          countOpenDueOnOrBefore(db, toISODate(now)),
          Promise.all(providers.map((p) => loadSummary(p, db, now))),
        ]);
        if (!active) return;
        setData({
          headline: buildHeadline(classes.length, dueCount),
          nextClass: pickNextClass(classes, now),
          tiles: providers.map((provider, i) => ({ provider, summary: summaries[i] })),
          deadlines,
        });
      }

      load().catch((error) => console.error('Dashboard failed to load', error));
      return () => {
        active = false;
      };
    }, [db, providers])
  );

  return data;
}