import { Pressable, Text, View } from 'react-native';
import { fonts, radius } from '@/constants/theme';
import { useTheme } from '@/theme';

export type SegmentOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel: string;
};

export function SegmentedControl<T extends string>({ options, value, onChange, accessibilityLabel }: Props<T>) {
  const { colors } = useTheme();

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={{ flexDirection: 'row', backgroundColor: colors.tint, borderRadius: radius.md, padding: 4 }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={{
              flex: 1,
              minHeight: 44,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: radius.sm + 2,
              backgroundColor: selected ? colors.surface : 'transparent',
            }}
          >
            <Text
              style={{
                fontFamily: selected ? fonts.semibold : fonts.medium,
                fontSize: 14,
                color: selected ? colors.text : colors.textMuted,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}