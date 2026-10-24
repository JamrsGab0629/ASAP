import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import type { Block } from '../types';

type Props = {
  blocks: Block[];
  /** How to draw text that is shown. The caller decides, so highlights keep working. */
  renderKept: (text: string) => ReactNode;
};

/** The shortened note. Hidden parts are a tappable bar that reveals the original text in place. */
export function ShortenedView({ blocks, renderKept }: Props) {
  const { colors } = useTheme();
  const [open, setOpen] = useState<ReadonlySet<number>>(new Set());

  const toggle = (index: number) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <View style={{ gap: space.md }}>
      {blocks.map((block, index) => {
        if (block.kind === 'kept') return <View key={index}>{renderKept(block.text.trimEnd())}</View>;

        const expanded = open.has(index);
        const Chevron = expanded ? ChevronUp : ChevronDown;
        return (
          <Pressable
            key={index}
            onPress={() => toggle(index)}
            style={{ gap: space.sm, padding: space.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
              <Chevron size={16} color={colors.textMuted} />
              <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted }}>
                {expanded ? 'Hide original text' : `+${block.hiddenCount} hidden · tap to show`}
              </Text>
            </View>
            {expanded && (
              <Text style={{ fontFamily: fonts.regular, fontSize: 15, lineHeight: 24, color: colors.textMuted }}>{block.text.trim()}</Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}