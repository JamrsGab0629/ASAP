import type { LucideIcon } from 'lucide-react-native';
import { Modal, Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';

export type MenuOption = { key: string; label: string; hint: string; icon: LucideIcon; onPress: () => void };

type Props = { visible: boolean; options: MenuOption[]; onClose: () => void };

/** A bottom sheet of ways to add a note. To add one (photos later), add an option. */
export function NewNoteMenu({ visible, options, onClose }: Props) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' }}>
        <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: space.xl, gap: space.sm }}>
          {options.map(({ key, label, hint, icon: Icon, onPress }) => (
            <Pressable
              key={key}
              onPress={() => {
                onClose();
                onPress();
              }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: space.lg, paddingVertical: space.md }}
            >
              <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.tint, alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.text }}>{label}</Text>
                <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>{hint}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}