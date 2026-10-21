import { Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';

export type Stat = { label: string; value: string };

export function StatGrid({ stats }: { stats: Stat[] }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: space.md }}>
      {stats.map((s) => (
        <View
          key={s.label}
          style={{ flex: 1, padding: space.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, gap: 2 }}
        >
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted }}>{s.label}</Text>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.text }}>{s.value}</Text>
        </View>
      ))}
    </View>
  );
}