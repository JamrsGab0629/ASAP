import { useRef, useState } from 'react';
import { Image, Pressable, ScrollView } from 'react-native';

const ZOOM = 2.5;

type Props = { uri: string; width: number; height: number; onZoomChange: (zoomed: boolean) => void };

export function ZoomableImage({ uri, width, height, onZoomChange }: Props) {
  const [zoomed, setZoomed] = useState(false);
  const vertical = useRef<ScrollView>(null);
  const horizontal = useRef<ScrollView>(null);

  const w = zoomed ? width * ZOOM : width;
  const h = zoomed ? height * ZOOM : height;

  const toggle = () => {
    const next = !zoomed;
    setZoomed(next);
    onZoomChange(next);
  };

  return (
    <ScrollView
      ref={vertical}
      style={{ width, height }}
      contentContainerStyle={{ height: h }}
      scrollEnabled={zoomed}
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() => zoomed && vertical.current?.scrollTo({ y: (h - height) / 2, animated: false })}
    >
      <ScrollView
        ref={horizontal}
        horizontal
        scrollEnabled={zoomed}
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: w }}
        onContentSizeChange={() => zoomed && horizontal.current?.scrollTo({ x: (w - width) / 2, animated: false })}
      >
        <Pressable onPress={toggle}>
          <Image source={{ uri }} style={{ width: w, height: h }} resizeMode="contain" />
        </Pressable>
      </ScrollView>
    </ScrollView>
  );
}