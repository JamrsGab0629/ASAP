import { Image, Pressable } from 'react-native';
import { radius } from '@/constants/theme';
import { useTheme } from '@/theme';
import { photoUri } from '../photoFiles';
import type { Photo } from '../types';

type Props = { photo: Photo; size: number; onPress: () => void };

export function PhotoThumb({ photo, size, onPress }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress}>
      <Image
        source={{ uri: photoUri(photo.thumbPath) }}
        style={{ width: size, height: size, borderRadius: radius.md, backgroundColor: colors.border }}
      />
    </Pressable>
  );
}