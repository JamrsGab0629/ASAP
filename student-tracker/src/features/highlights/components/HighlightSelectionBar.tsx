import { Check, Highlighter } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
type Props = { visible: boolean; preview: string; confirmed: boolean; onPress: () => void };

const shorten = (text: string) => {
  const flat = text.replace(/\s+/g, ' ');
  return flat.length > 40 ? `${flat.slice(0, 40)}…` : flat;
};

export function HighlightSelectionBar({ visible, preview, confirmed, onPress }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  if (!visible && !confirmed) return null;

  return (
        <View
      style={{
        padding: space.md,
        paddingBottom: insets.bottom + space.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      {confirmed ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm, padding: space.md }}>
          <Check size={18} color={colors.primary} />
          <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.text }}>Highlighted. Switch to Read to see it.</Text>
        </View>
      ) : (
        <Pressable
          onPress={onPress}
          accessibilityLabel="Highlight selection"
          style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.md, backgroundColor: colors.primary }}
        >
          <Highlighter size={18} color={colors.onPrimary} />
          <Text numberOfLines={1} style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 14, color: colors.onPrimary }}>
            Highlight “{shorten(preview)}”
          </Text>
        </Pressable>
      )}
    </View>
  );
}