import { Pressable, Text, View } from 'react-native';
import { fonts, space } from '@/constants/theme';
import { formatPeso } from '@/lib/format';
import { useTheme } from '@/theme';
import type { Entry } from '../types';

type Props = { entry: Entry; onPress: (e: Entry) => void; onLongPress: (e: Entry) => void };

export function EntryRow({ entry, onPress, onLongPress }: Props) {
  const { colors } = useTheme();
  const isIncome = entry.type === 'income';
  const title = entry.note ?? entry.category ?? (isIncome ? 'Extra money' : 'Expense');
  const subtitle = entry.note && entry.category ? entry.category : isIncome ? 'Extra money' : null;

  return (
    <Pressable
      onPress={() => onPress(entry)}
      onLongPress={() => onLongPress(entry)}
      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.md }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.text }}>{title}</Text>
        {subtitle && <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>{subtitle}</Text>}
      </View>
      <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: isIncome ? colors.success : colors.text }}>
        {isIncome ? '+' : '−'}{formatPeso(entry.amount)}
      </Text>
    </Pressable>
  );
}