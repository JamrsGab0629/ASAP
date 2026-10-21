import { Pressable, ScrollView, Text } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { GradePeriod } from '../types';

export type PeriodTab = 'overall' | number;

type Props = {
  periods: GradePeriod[];
  selected: PeriodTab;
  onSelect: (tab: PeriodTab) => void;
  onAdd: () => void;
};

export function PeriodTabs({ periods, selected, onSelect, onAdd }: Props) {
  const { colors } = useTheme();

  const chip = (key: string, label: string, on: boolean, onPress: () => void, outlined = false) => (
    <Pressable
      key={key}
      onPress={onPress}
      style={{
        paddingHorizontal: space.lg, paddingVertical: space.sm, borderRadius: radius.pill, borderWidth: 1,
        borderColor: on || outlined ? colors.primary : colors.border,
        backgroundColor: on ? colors.primary : 'transparent',
      }}
    >
      <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: on ? colors.onPrimary : outlined ? colors.primary : colors.text }}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
      {chip('overall', 'Overall', selected === 'overall', () => onSelect('overall'))}
      {periods.map((p) => chip(String(p.id), p.name, selected === p.id, () => onSelect(p.id)))}
      {chip('add', '+ Period', false, onAdd, true)}
    </ScrollView>
  );
}