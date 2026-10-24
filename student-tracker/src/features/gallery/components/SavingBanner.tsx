import { Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { SaveProgress } from '../types';

export function SavingBanner({ progress }: { progress: SaveProgress }) {
  const { colors } = useTheme();
  const ratio = progress.total === 0 ? 0 : progress.done / progress.total;
  return (
    <View style={{ gap: space.sm, padding: space.lg, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
      <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.text }}>
        Saving {Math.min(progress.done + 1, progress.total)} of {progress.total}…
      </Text>
      <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' }}>
        <View style={{ width: `${ratio * 100}%`, height: '100%', backgroundColor: colors.primary }} />
      </View>
    </View>
  );
}