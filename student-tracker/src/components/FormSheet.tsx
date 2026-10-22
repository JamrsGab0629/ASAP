import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';

type Props = {
  title: string;
  onClose: () => void;
  onSave: () => void;
  saveLabel?: string;
  saveDisabled?: boolean;
  children: ReactNode;
};

/** Full-screen modal with a title, Cancel and Save. The fields go inside. */
export function FormSheet({ title, onClose, onSave, saveLabel = 'Save', saveDisabled = false, children }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: space.xl, paddingTop: insets.top + space.lg }}>
          <Text style={{ fontFamily: fonts.serif, fontSize: 26, color: colors.text }}>{title}</Text>
          {children}
        </ScrollView>
        <View style={{ flexDirection: 'row', gap: space.md, padding: space.xl }}>
          <Pressable onPress={onClose}
            style={{ flex: 1, padding: space.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }}>
            <Text style={{ fontFamily: fonts.semibold, color: colors.text }}>Cancel</Text>
          </Pressable>
          <Pressable onPress={onSave} disabled={saveDisabled}
            style={{ flex: 1, padding: space.lg, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center', opacity: saveDisabled ? 0.4 : 1 }}>
            <Text style={{ fontFamily: fonts.semibold, color: colors.onPrimary }}>{saveLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}