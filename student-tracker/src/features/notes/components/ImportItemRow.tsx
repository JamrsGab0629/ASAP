import { Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { FileAnalysis } from '../import/analyzeFile';

export function ImportItemRow({ item }: { item: FileAnalysis }) {
  const { colors } = useTheme();
  const ready = item.status === 'ready';
  const name = ready ? item.file.name : item.name;

  const stats = ready
    ? [item.unit ? `${item.sectionCount} ${item.unit}${item.sectionCount === 1 ? '' : 's'}` : null, `${item.wordCount} words`]
        .filter(Boolean)
        .join(' · ')
    : null;

  return (
    <View
      style={{
        padding: space.lg, gap: 2, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
        backgroundColor: colors.surface, opacity: ready ? 1 : 0.7,
      }}
    >
      <Text numberOfLines={1} style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.text }}>{name}</Text>
      {ready ? (
        <>
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>{stats}</Text>
          {item.body ? (
            <Text numberOfLines={2} style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>
              {item.body.replace(/\s+/g, ' ').slice(0, 120)}
            </Text>
          ) : null}
          {item.note ? <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.warning }}>{item.note}</Text> : null}
        </>
      ) : (
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.danger }}>{item.message}</Text>
      )}
    </View>
  );
}