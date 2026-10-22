import { Paperclip } from 'lucide-react-native';
import { Alert, Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import { resolveStoredFile, storedDisplayName } from '../noteFiles';

export function AttachmentBar({ filePath }: { filePath: string }) {
  const { colors } = useTheme();

  const open = async () => {
    try {
      await resolveStoredFile(filePath).preview();
    } catch {
      Alert.alert("Couldn't open the file", 'Install an app that can open this kind of file, such as a PDF or PowerPoint viewer.');
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md,
        borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
      }}
    >
      <Paperclip size={18} color={colors.textMuted} />
      <Text numberOfLines={1} style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.text }}>
        {storedDisplayName(filePath)}
      </Text>
      <Pressable onPress={open} hitSlop={8}>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.primary }}>Open</Text>
      </Pressable>
    </View>
  );
}