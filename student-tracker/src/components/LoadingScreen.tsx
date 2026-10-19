import { ActivityIndicator, Text, View } from 'react-native';
import { fonts } from '@/constants/theme';
import { useTheme } from '@/theme';

export function LoadingScreen() {
  const { colors } = useTheme();

  return (
    <View
      accessible
      accessibilityLabel="Loading ASAP"
      style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 8 }}
    >
      <Text style={{ fontFamily: fonts.serif, fontSize: 48, color: colors.primary }}>ASAP</Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted }}>
        All-in-one Student Assistant & Planner
      </Text>
      <ActivityIndicator color={colors.primary} style={{ marginTop: 28 }} />
    </View>
  );
}