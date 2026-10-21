import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import { componentPercent } from '../standing';
import type { GradeComponent, GradeItem } from '../types';

type Props = {
  component: GradeComponent;
  onEdit: (c: GradeComponent) => void;
  onLongPress: (c: GradeComponent) => void;
  onAddItem: (c: GradeComponent) => void;
  onEditItem: (c: GradeComponent, item: GradeItem) => void;
  onLongPressItem: (item: GradeItem) => void;
};

export function ComponentCard({ component, onEdit, onLongPress, onAddItem, onEditItem, onLongPressItem }: Props) {
  const { colors } = useTheme();
  const percent = componentPercent(component);

  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
      <Pressable
        onPress={() => onEdit(component)}
        onLongPress={() => onLongPress(component)}
        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: space.lg }}
      >
        <View>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.text }}>{component.name}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>{component.weight}% of the grade</Text>
        </View>
        <Text style={{ fontFamily: fonts.serif, fontSize: 22, color: percent === null ? colors.textMuted : colors.text }}>
          {percent === null ? '—' : `${percent.toFixed(0)}%`}
        </Text>
      </Pressable>

      {component.items.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => onEditItem(component, item)}
          onLongPress={() => onLongPressItem(item)}
          style={{
            flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: space.lg,
            paddingVertical: space.md, borderTopWidth: 1, borderTopColor: colors.border,
          }}
        >
          <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.text }}>{item.title}</Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: item.score === null ? colors.textMuted : colors.text }}>
            {item.score === null ? 'Not scored' : `${item.score}/${item.maxScore}`}
          </Text>
        </Pressable>
      ))}

      <Pressable onPress={() => onAddItem(component)} style={{ padding: space.md, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'center' }}>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.primary }}>+ Add item</Text>
      </Pressable>
    </View>
  );
}