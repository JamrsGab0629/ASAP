import { Pressable, Text, View } from 'react-native';
import { fonts } from '@/constants/theme';
import { useTheme } from '@/theme';

type Props = { title: string; actionLabel?: string; onAction?: () => void };

export function SectionHeader({ title, actionLabel, onAction }: Props) {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ fontFamily: fonts.serif, fontSize: 20, color: colors.text }}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8} style={{ minHeight: 44, justifyContent: 'center' }}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.primary }}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}