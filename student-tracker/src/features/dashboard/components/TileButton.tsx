import { Pressable, Text, View } from 'react-native';
import { fonts, radius } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { ResolvedTile } from '../types';

type Props = { tile: ResolvedTile; onPress: () => void };

export function TileButton({ tile, onPress }: Props) {
  const { colors } = useTheme();
  const { provider, summary } = tile;
  const Icon = provider.icon;
  const ready = provider.href !== null;
  const valueText = ready ? summary.text : 'Coming soon';

  return (
    <Pressable
      onPress={onPress}
      disabled={!ready}
      accessibilityRole="button"
      accessibilityLabel={`${provider.label}, ${valueText}`}
      style={{
        flexGrow: 1,
        flexBasis: '45%',
        minHeight: 64,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 12,
        borderRadius: radius.md,
        backgroundColor: colors.tint,
        opacity: ready ? 1 : 0.6,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={20} color={colors.primary} strokeWidth={1.8} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted }}>{provider.label}</Text>
        <Text
          numberOfLines={1}
          style={{ fontFamily: fonts.semibold, fontSize: 15, color: summary.attention ? colors.warning : colors.text }}
        >
          {valueText}
        </Text>
      </View>
    </Pressable>
  );
}