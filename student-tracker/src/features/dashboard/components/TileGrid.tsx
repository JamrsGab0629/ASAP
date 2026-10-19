import { View } from 'react-native';
import { useRouter } from 'expo-router';
import type { ResolvedTile } from '../types';
import { TileButton } from './TileButton';

type Props = { tiles: ResolvedTile[] };

export function TileGrid({ tiles }: Props) {
  const router = useRouter();

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
      {tiles.map((tile) => (
        <TileButton
          key={tile.provider.id}
          tile={tile}
          onPress={() => {
            if (tile.provider.href) router.push(tile.provider.href);
          }}
        />
      ))}
    </View>
  );
}