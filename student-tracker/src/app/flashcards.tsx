import { useRouter } from 'expo-router';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts, radius, space } from '@/constants/theme';
import { CardSheet } from '@/features/flashcards/components/CardSheet';
import { DeckRow } from '@/features/flashcards/components/DeckRow';
import { allDecksStudyCount } from '@/features/flashcards/deckTotals';
import { useCardEditor } from '@/features/flashcards/useCardEditor';
import { useDecks } from '@/features/flashcards/useDecks';
import { useSubjectOptions } from '@/hooks/useSubjectOptions';
import { useTheme } from '@/theme';

export default function FlashcardsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const subjects = useSubjectOptions();
  const { state, reload } = useDecks();
  const editor = useCardEditor(subjects, reload);

  const decks = state?.decks ?? [];
  const newLeft = state?.newLeft ?? 0;
  const studyAll = allDecksStudyCount(decks, newLeft);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={decks}
        keyExtractor={(d) => String(d.subjectId)}
        contentContainerStyle={{ padding: space.xl, paddingTop: insets.top + space.lg, gap: space.md }}
        ListHeaderComponent={
          <View style={{ gap: space.lg, marginBottom: space.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Back">
                  <ChevronLeft size={26} color={colors.text} />
                </Pressable>
                <Text style={{ fontFamily: fonts.serif, fontSize: 28, color: colors.text }}>Flashcards</Text>
              </View>
              <Pressable
                onPress={() => editor.openNew()}
                accessibilityLabel="Add a card"
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={20} color={colors.onPrimary} />
              </Pressable>
            </View>

            <Pressable
              onPress={() => router.push('/review')}
              disabled={studyAll === 0}
              style={{ padding: space.lg, borderRadius: radius.lg, backgroundColor: colors.primary, alignItems: 'center', opacity: studyAll === 0 ? 0.4 : 1 }}
            >
              <Text style={{ fontFamily: fonts.semibold, fontSize: 17, color: colors.onPrimary }}>
                {studyAll === 0 ? 'All caught up' : `Study all · ${studyAll} card${studyAll === 1 ? '' : 's'}`}
              </Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <DeckRow
            deck={item}
            newLeft={newLeft}
            onOpen={() => router.push({ pathname: '/deck', params: { subjectId: String(item.subjectId) } })}
            onStudy={() => router.push({ pathname: '/review', params: { subjectId: String(item.subjectId) } })}
          />
        )}
        ListEmptyComponent={
          state ? (
            <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, textAlign: 'center', marginTop: space.xxl }}>
              Add a subject first, then make cards for it.
            </Text>
          ) : null
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