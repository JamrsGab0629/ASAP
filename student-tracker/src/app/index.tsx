import { ScrollView, View } from 'react-native';
import { SectionHeader } from '@/components/SectionHeader';
import { space } from '@/constants/theme';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import { DueSoonList } from '@/features/dashboard/components/DueSoonList';
import { NextClassCard } from '@/features/dashboard/components/NextClassCard';
import { SettingsButton } from '@/features/dashboard/components/SettingsButton';
import { TileGrid } from '@/features/dashboard/components/TileGrid';
import { useDashboard } from '@/features/dashboard/useDashboard';
import { formatLongDate } from '@/lib/dates';
import { useTheme } from '@/theme';

export default function HomeScreen() {
  const { colors } = useTheme();
  const data = useDashboard();

  if (!data) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: 40, paddingHorizontal: space.xl, paddingBottom: 40, gap: space.xxl }}
    >
      <SettingsButton />
      <DashboardHeader dateLabel={formatLongDate(new Date())} headline={data.headline} />
      <NextClassCard next={data.nextClass} />
      <TileGrid tiles={data.tiles} />
      <View style={{ gap: space.md }}>
        <SectionHeader title="Due soon" />
        <DueSoonList deadlines={data.deadlines} />
      </View>
    </ScrollView>
  );
}