import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { LengthLevel } from '../levels';

type Props = { levels: LengthLevel[]; selected: string; onSelect: (key: string) => void };

export function LengthSelector({ levels, selected, onSelect }: Props) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: space.sm }}>
      {levels.map((level) => {
        const active = level.key === selected;
        return (
          <Pressable
            key={level.key}
            onPress={() => onSelect(level.key)}
            accessibilityLabel={`${level.label}: ${level.hint}`}
            style={{
              flex: 1, alignItems: 'center', paddingVertical: space.sm, borderRadius: radius.md, borderWidth: 1,
              borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.tint : 'transparent',
            }}
          >
            <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.text }}>{level.label}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted }}>{level.hint}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}