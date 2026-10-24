import { useRouter } from 'expo-router';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts, space } from '@/constants/theme';
import { AddPhotosSheet } from '@/features/gallery/components/AddPhotosSheet';
import { AlbumCard } from '@/features/gallery/components/AlbumCard';
import { PhotoSourceMenu } from '@/features/gallery/components/PhotoSourceMenu';
import { SavingBanner } from '@/features/gallery/components/SavingBanner';
import { SubjectFilter } from '@/features/gallery/components/SubjectFilter';
import type { Album } from '@/features/gallery/types';
import { useAddPhotos } from '@/features/gallery/useAddPhotos';
import { useGallery } from '@/features/gallery/useGallery';
import { useSubjectOptions } from '@/hooks/useSubjectOptions';
import { useTheme } from '@/theme';

export default function GalleryScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const subjects = useSubjectOptions();

  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { albums, reload } = useGallery(subjectId);
  const add = useAddPhotos(subjects, subjectId, reload);

  const data: (Album | null)[] = albums.length % 2 === 1 ? [...albums, null] : albums;
  const openAlbum = (album: Album) =>
    router.push({ pathname: '/album', params: { subjectId: String(album.subjectId), lesson: album.lesson } });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={data}
        numColumns={2}
        columnWrapperStyle={{ gap: space.md }}
        keyExtractor={(a) => a?.key ?? 'spacer'}
        contentContainerStyle={{ padding: space.xl, paddingTop: insets.top + space.lg, gap: space.md }}
        ListHeaderComponent={
          <View style={{ gap: space.lg, marginBottom: space.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Back">
                  <ChevronLeft size={26} color={colors.text} />
                </Pressable>
                <Text style={{ fontFamily: fonts.serif, fontSize: 28, color: colors.text }}>Lecture photos</Text>
              </View>
              <Pressable
                onPress={() => setMenuOpen(true)}
                accessibilityLabel="Add photos"
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={20} color={colors.onPrimary} />
              </Pressable>
            </View>
            <SubjectFilter subjects={subjects} selectedId={subjectId} onSelect={setSubjectId} />
            {add.progress && add.pending === null && <SavingBanner progress={add.progress} />}
          </View>
        }
        renderItem={({ item }) => (item ? <AlbumCard album={item} onPress={openAlbum} /> : <View style={{ flex: 1 }} />)}
        ListEmptyComponent={
          <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, textAlign: 'center', marginTop: space.xxl }}>
            {subjects.length === 0 ? 'Add a subject first, then you can file photos under it.' : 'No photos yet. Tap + to add lecture photos.'}
          </Text>
        }
      />

      <PhotoSourceMenu visible={menuOpen} onClose={() => setMenuOpen(false)} onPick={add.pick} />

      {add.pending && (
        <AddPhotosSheet
          photos={add.pending}
          subjects={subjects}
          initialSubjectId={add.initialSubjectId}
          progress={add.progress}
          onCancel={add.cancel}
          onConfirm={add.confirm}
        />
      )}
    </View>
  );
}