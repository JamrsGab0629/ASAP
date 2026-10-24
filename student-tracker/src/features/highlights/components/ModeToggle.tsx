import { BookOpen, Pencil } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';

export type NoteMode = 'write' | 'read';

const OPTIONS = [
  { mode: 'write', label: 'Write', icon: Pencil },
  { mode: 'read', label: 'Read', icon: BookOpen },
] as const;

type Props = { mode: NoteMode; onChange: (mode: NoteMode) => void };

export function ModeToggle({ mode, onChange }: Props) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', padding: 3, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, alignSelf: 'flex-start' }}>
      {OPTIONS.map(({ mode: key, label, icon: Icon }) => {
        const active = key === mode;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.sm, paddingHorizontal: space.lg, borderRadius: radius.pill, backgroundColor: active ? colors.primary : 'transparent' }}
          >
            <Icon size={14} color={active ? colors.onPrimary : colors.textMuted} />
            <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: active ? colors.onPrimary : colors.textMuted }}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}