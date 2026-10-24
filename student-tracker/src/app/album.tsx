import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Pencil, Plus, Trash2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts, space } from '@/constants/theme';
import { PhotoSourceMenu } from '@/features/gallery/components/PhotoSourceMenu';
import { PhotoThumb } from '@/features/gallery/components/PhotoThumb';
import { PhotoViewer } from '@/features/gallery/components/PhotoViewer';
import { RenameLessonSheet } from '@/features/gallery/components/RenameLessonSheet';
import { SavingBanner } from '@/features/gallery/components/SavingBanner';
import type { PhotoSource } from '@/features/gallery/photoSources';
import { useAlbumActions } from '@/features/gallery/useAlbumActions';
import { useAlbumPhotos } from '@/features/gallery/useAlbumPhotos';
import { useSavePhotos } from '@/features/gallery/useSavePhotos';
import { useTheme } from '@/theme';

const COLUMNS = 3;
const GAP = space.sm;

export default function AlbumScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ subjectId: string; lesson: string }>();
  const subjectId = Number(params.subjectId);
  const lesson = params.lesson ?? '';

  const { photos, loaded, reload } = useAlbumPhotos(subjectId, lesson);
  const actions = useAlbumActions(subjectId, lesson, photos, reload);
  const { progress, save } = useSavePhotos(reload);

  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);

  useEffect(() => {
    if (loaded && photos.length === 0) router.back();
  }, [loaded, photos.length, router]);

  const addFrom = async (source: PhotoSource) => {
    const picked = await source.pick();
    if (picked.length > 0) await save(picked, { subjectId, lesson });
  };

  const size = (width - space.xl * 2 - GAP * (COLUMNS - 1)) / COLUMNS;
  const iconButton = { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' } as const;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={photos}
        numColumns={COLUMNS}
        columnWrapperStyle={{ gap: GAP }}
        keyExtractor={(p) => String(p.id)}
        contentContainerStyle={{ padding: space.xl, paddingTop: insets.top + space.lg, gap: GAP }}
        ListHeaderComponent={
          <View style={{ gap: space.md, marginBottom: space.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Back">
                <ChevronLeft size={26} color={colors.text} />
              </Pressable>
              <View style={{ flexDirection: 'row' }}>
                <Pressable onPress={() => setRenaming(true)} style={iconButton} accessibilityLabel="Rename lesson">
                  <Pencil size={20} color={colors.textMuted} />
                </Pressable>
                <Pressable onPress={actions.deleteAlbum} style={iconButton} accessibilityLabel="Delete album">
                  <Trash2 size={20} color={colors.textMuted} />
                </Pressable>
                <Pressable onPress={() => setMenuOpen(true)} style={[iconButton, { borderRadius: 20, backgroundColor: colors.primary }]} accessibilityLabel="Add photos">
                  <Plus size={20} color={colors.onPrimary} />
                </Pressable>
              </View>
            </View>
            <View>
              <Text style={{ fontFamily: fonts.serif, fontSize: 28, color: colors.text }}>{lesson}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted }}>
                {photos[0]?.subjectName} · {photos.length} photo{photos.length === 1 ? '' : 's'}
              </Text>
            </View>
            {progress && <SavingBanner progress={progress} />}
          </View>
        }
        renderItem={({ item, index }) => <PhotoThumb photo={item} size={size} onPress={() => setViewerIndex(index)} />}
      />

      <PhotoSourceMenu visible={menuOpen} onClose={() => setMenuOpen(false)} onPick={addFrom} />

      {viewerIndex !== null && photos.length > 0 && (
        <PhotoViewer photos={photos} startIndex={viewerIndex} onClose={() => setViewerIndex(null)} onDelete={actions.deletePhoto} />
      )}

      {renaming && (
        <RenameLessonSheet
          lesson={lesson}
          onCancel={() => setRenaming(false)}
          onSave={(name) => {
            setRenaming(false);
            actions.rename(name);
          }}
        />
      )}
    </View>
  );
}