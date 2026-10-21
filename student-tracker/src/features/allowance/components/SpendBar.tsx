import { View } from 'react-native';

type Props = { fraction: number; color: string; trackColor: string; markerColor: string; markerAt?: number };

/** A progress bar with a thin tick (default 80%) where the warning zone starts. */
export function SpendBar({ fraction, color, trackColor, markerColor, markerAt = 0.8 }: Props) {
  const width = `${Math.min(1, Math.max(0, fraction)) * 100}%` as const;
  return (
    <View style={{ height: 10, borderRadius: 5, backgroundColor: trackColor, overflow: 'hidden' }}>
      <View style={{ height: 10, width, backgroundColor: color, borderRadius: 5 }} />
      <View style={{ position: 'absolute', left: `${markerAt * 100}%`, top: 0, bottom: 0, width: 2, backgroundColor: markerColor }} />
    </View>
  );
}