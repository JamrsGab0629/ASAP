import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { colors, fonts } from '../constants/theme';
import { Link } from 'expo-router';


export default function Home() {
  const db = useSQLiteContext();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    db.getFirstAsync<{ c: number }>('SELECT COUNT(*) AS c FROM subjects').then((r) =>
      setCount(r?.c ?? 0)
    );
  }, [db]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
      <Text style={{ fontFamily: fonts.serif, fontSize: 32, color: colors.text }}>ASAP</Text>
      <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, marginTop: 8 }}>
        Database ready · {count ?? '…'} subjects
      </Text>
      <Link
  href="/subjects"
  style={{ marginTop: 24, fontFamily: fonts.semibold, fontSize: 16, color: colors.primary }}
>
  Open Subjects
</Link>
    </View>
  );
}