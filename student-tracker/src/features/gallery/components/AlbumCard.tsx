import { Image, Pressable, Text, View } from 'react-native';
import { fonts, radius, space } from '@/constants/theme';
import { useTheme } from '@/theme';
import { photoUri } from '../photoFiles';
import type { Album } from '../types';

type Props = { album: Album; onPress: (album: Album) => void };

export function AlbumCard({ album, onPress }: Props) {
  const { colors } = useTheme();
  const count = album.photos.length;
  return (
    <Pressable
      onPress={() => onPress(album)}
      style={{ flex: 1, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, overflow: 'hidden' }}
    >
      <Image source={{ uri: photoUri(album.photos[0].thumbPath) }} style={{ width: '100%', aspectRatio: 4 / 3, backgroundColor: colors.border }} />
      <View style={{ padding: space.md, gap: 2 }}>
        <Text numberOfLines={1} style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.text }}>{album.lesson}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: album.subjectColor }} />
          <Text numberOfLines={1} style={{ flexShrink: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted }}>
            {album.subjectName} · {count} photo{count === 1 ? '' : 's'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}