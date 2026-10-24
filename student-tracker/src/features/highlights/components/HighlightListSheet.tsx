import { X } from 'lucide-react-native';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import { HIGHLIGHT_BG } from '../highlightStyle';
import type { Highlight } from '../types';

type Props = { highlights: Highlight[]; onRemove: (id: number) => void; onClose: () => void };

export function HighlightListSheet({ highlights, onRemove, onClose }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + space.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.xl, marginBottom: space.lg }}>
          <Text style={{ fontFamily: fonts.serif, fontSize: 26, color: colors.text }}>Highlights ({highlights.length})</Text>
          <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close"><X size={24} color={colors.text} /></Pressable>
        </View>
        <FlatList
          data={highlights}
          keyExtractor={(h) => String(h.id)}
          contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: insets.bottom + space.xl, gap: space.md }}
          ListEmptyComponent={
            <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, textAlign: 'center', marginTop: space.xxl }}>
              Nothing highlighted yet. Tap a sentence in Read view.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', gap: space.md, alignItems: 'flex-start', padding: space.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}>
              <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.text, backgroundColor: HIGHLIGHT_BG }}>
                {item.text}
              </Text>
              <Pressable onPress={() => onRemove(item.id)} hitSlop={10} accessibilityLabel="Remove highlight">
                <X size={18} color={colors.textMuted} />
              </Pressable>
            </View>
          )}
        />
      </View>
    </Modal>
  );
}