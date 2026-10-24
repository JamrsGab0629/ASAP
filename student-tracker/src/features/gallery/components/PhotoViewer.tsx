import { Trash2, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts, space } from '@/constants/theme';
import { photoUri } from '../photoFiles';
import type { Photo } from '../types';
import { ZoomableImage } from './ZoomableImage';

const BAR_HEIGHT = 56;

type Props = { photos: Photo[]; startIndex: number; onClose: () => void; onDelete: (photo: Photo) => void };

export function PhotoViewer({ photos, startIndex, onClose, onDelete }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);
  const list = useRef<FlatList<Photo>>(null);

  const current = Math.min(index, photos.length - 1);
  const photo = photos[current];
  const imageHeight = height - insets.top - insets.bottom - BAR_HEIGHT;

  const confirmDelete = () =>
    Alert.alert('Delete this photo?', 'It will be removed from this album.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(photo) },
    ]);

  return (
    <Modal visible animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#000', paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <View style={{ height: BAR_HEIGHT, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.xl }}>
          <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close"><X size={24} color="#fff" /></Pressable>
          <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: '#fff' }}>{current + 1} / {photos.length}</Text>
          <Pressable onPress={confirmDelete} hitSlop={12} accessibilityLabel="Delete photo"><Trash2 size={22} color="#fff" /></Pressable>
        </View>
        <FlatList
          key={photos.length}
          ref={list}
          data={photos}
          horizontal
          pagingEnabled
          scrollEnabled={!zoomed}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={current}
          getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
          keyExtractor={(p) => String(p.id)}
          onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
          renderItem={({ item }) => (
            <ZoomableImage uri={photoUri(item.filePath)} width={width} height={imageHeight} onZoomChange={setZoomed} />
          )}
        />
      </View>
    </Modal>
  );
}