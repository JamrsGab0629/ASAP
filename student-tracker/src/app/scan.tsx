import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts, space } from '@/constants/theme';
import { EditSuggestionSheet } from '@/features/flashcards/components/EditSuggestionSheet';
import { NotePicker } from '@/features/flashcards/components/NotePicker';
import { SuggestionRow } from '@/features/flashcards/components/SuggestionRow';
import { useNoteScan } from '@/features/flashcards/useNoteScan';
import { useTheme } from '@/theme';
import { RewriteBar } from '@/features/flashcards/components/RewriteBar';

function ScanResults({ noteId }: { noteId: number }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scan = useNoteScan(noteId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = scan.cards.find((c) => c.id === editingId) ?? null;
  const count = scan.picked.size;

  const add = async () => {
    const added = await scan.addPicked();
    if (!scan.note) return;
    Alert.alert(`${added} card${added === 1 ? '' : 's'} added`, 'You can study them from the Flashcards screen.', [
      { text: 'OK', onPress: () => router.replace({ pathname: '/deck', params: { subjectId: String(scan.note!.subjectId) } }) },
    ]);
  };

  const summary = scan.loading
    ? 'Reading your note…'
    : scan.cards.length === 0
      ? 'No new cards found. Try highlighting key sentences, or write lines like "Term: definition".'
      : `Found ${scan.cards.length} possible card${scan.cards.length === 1 ? '' : 's'}. Tick the ones you want.`;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={scan.cards}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: space.xl, paddingTop: insets.top + space.lg, paddingBottom: 120, gap: space.md }}
        ListHeaderComponent={
          <View style={{ gap: space.md, marginBottom: space.sm }}>
            <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Back">
              <ChevronLeft size={26} color={colors.text} />
            </Pressable>
            <Text style={{ fontFamily: fonts.serif, fontSize: 28, color: colors.text }}>Make flashcards</Text>
            {scan.note && <Text numberOfLines={1} style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.primary }}>{scan.note.title || 'Untitled'}</Text>}
            <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted }}>{summary}</Text>
            <RewriteBar status={scan.rewrite} available={scan.canRewriteAny} onStart={scan.startRewrite} onCancel={scan.cancelRewrite} />
            {scan.cards.length > 0 && (
              <View style={{ flexDirection: 'row', gap: space.lg }}>
                <Pressable onPress={() => scan.setAll(true)}><Text style={{ fontFamily: fonts.medium, color: colors.primary }}>Select all</Text></Pressable>
                <Pressable onPress={() => scan.setAll(false)}><Text style={{ fontFamily: fonts.medium, color: colors.primary }}>Clear</Text></Pressable>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <SuggestionRow suggestion={item} picked={scan.picked.has(item.id)} onToggle={() => scan.toggle(item.id)} onEdit={() => setEditingId(item.id)} />
        )}
      />

      {count > 0 && (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: space.xl, paddingBottom: insets.bottom + space.lg, backgroundColor: colors.bg }}>
          <Pressable
            onPress={add}
            disabled={scan.adding}
            style={{ padding: space.lg, borderRadius: 999, alignItems: 'center', backgroundColor: colors.primary, opacity: scan.adding ? 0.6 : 1 }}
          >
            <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.onPrimary }}>Add {count} card{count === 1 ? '' : 's'}</Text>
          </Pressable>
        </View>
      )}

      {editing && (
        <EditSuggestionSheet
          suggestion={editing}
          onClose={() => setEditingId(null)}
          onSave={(change) => {
            scan.edit(editing.id, change);
            setEditingId(null);
          }}
        />
      )}
    </View>
  );
}

export default function ScanScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { noteId: param } = useLocalSearchParams<{ noteId?: string }>();
  const [picked, setPicked] = useState<number | null>(param ? Number(param) : null);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {picked !== null ? (
        <ScanResults noteId={picked} />
      ) : (
        <View style={{ padding: space.xl, paddingTop: insets.top + space.lg, gap: space.md }}>
          <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Back">
            <ChevronLeft size={26} color={colors.text} />
          </Pressable>
          <Text style={{ fontFamily: fonts.serif, fontSize: 28, color: colors.text }}>Scan a note</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, marginBottom: space.sm }}>
            Pick a note and I'll suggest flashcards from it.
          </Text>
          <NotePicker onPick={setPicked} />
        </View>
      )}
    </View>
  );
}