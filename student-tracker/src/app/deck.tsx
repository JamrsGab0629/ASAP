import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts, space } from '@/constants/theme';
import { CardRow } from '@/features/flashcards/components/CardRow';
import { CardSheet } from '@/features/flashcards/components/CardSheet';
import { useCardEditor } from '@/features/flashcards/useCardEditor';
import { useDeckCards } from '@/features/flashcards/useDeckCards';
import { useSubjectOptions } from '@/hooks/useSubjectOptions';
import { useTheme } from '@/theme';

export default function DeckScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { subjectId: param } = useLocalSearchParams<{ subjectId: string }>();
  const subjectId = Number(param);
  const subjects = useSubjectOptions();
  const { cards, reload } = useDeckCards(subjectId);
  const editor = useCardEditor(subjects, reload);

  const deckName = subjects.find((s) => s.id === subjectId)?.name ?? 'Deck';
  const now = new Date();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={cards}
        keyExtractor={(c) => String(c.id)}
        contentContainerStyle={{ padding: space.xl, paddingTop: insets.top + space.lg, gap: space.md }}
        ListHeaderComponent={
          <View style={{ gap: space.md, marginBottom: space.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Back">
                <ChevronLeft size={26} color={colors.text} />
              </Pressable>
              <Pressable
                onPress={() => editor.openNew(subjectId)}
                accessibilityLabel="Add a card"
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={20} color={colors.onPrimary} />
              </Pressable>
            </View>
            <Text style={{ fontFamily: fonts.serif, fontSize: 28, color: colors.text }}>{deckName}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted }}>
              {cards.length} card{cards.length === 1 ? '' : 's'}. Tap one to edit it.
            </Text>
          </View>
        }
        renderItem={({ item }) => <CardRow card={item} now={now} onPress={() => editor.openEdit(item)} />}
        ListEmptyComponent={
          <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, textAlign: 'center', marginTop: space.xxl }}>
            No cards yet. Tap + to add one.
          </Text>
        }
      />

      {editor.editing && (
        <CardSheet
          card={editor.editing.card}
          initialSubjectId={editor.editing.subjectId}
          subjects={subjects}
          onClose={editor.close}
          onSave={editor.save}
          onDelete={editor.remove}
        />
      )}
    </View>
  );
}