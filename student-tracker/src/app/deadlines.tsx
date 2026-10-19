import { useSQLiteContext } from 'expo-sqlite';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, SectionList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SegmentedControl } from '@/components/SegmentedControl';
import { fonts, space } from '@/constants/theme';
import { AddDeadlineSheet } from '@/features/deadlines/components/AddDeadlineSheet';
import { DeadlineRow } from '@/features/deadlines/components/DeadlineRow';
import { addDeadline, deleteDeadline, setDeadlineDone } from '@/features/deadlines/deadlineMutations';
import { groupDeadlines, type DeadlineSection } from '@/features/deadlines/groupDeadlines';
import type { DeadlineDraft, DeadlineStatus } from '@/features/deadlines/types';
import type { DueDeadline } from '@/features/deadlines/upcomingDeadlines';
import { useDeadlines } from '@/features/deadlines/useDeadlines';
import { useSubjectOptions } from '@/hooks/useSubjectOptions';
import { useTheme } from '@/theme';

export default function DeadlinesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();
  const subjects = useSubjectOptions();
  const [status, setStatus] = useState<DeadlineStatus>('open');
  const [adding, setAdding] = useState(false);
  const { items, now, reload } = useDeadlines(status);

  const sections: DeadlineSection[] =
    status === 'open' ? groupDeadlines(items, now) : items.length ? [{ title: 'Completed', data: items }] : [];

  const save = async (draft: DeadlineDraft) => {
    await addDeadline(db, draft);
    setAdding(false);
    reload();
  };

  const toggle = async (item: DueDeadline) => {
    await setDeadlineDone(db, item.id, status === 'open');
    reload();
  };

  const confirmDelete = (item: DueDeadline) =>
    Alert.alert(item.title, 'Delete this deadline?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteDeadline(db, item.id);
          reload();
        },
      },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SectionList
        sections={sections}
        keyExtractor={(d) => String(d.id)}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ padding: space.xl, paddingTop: insets.top + space.lg, gap: space.md }}
        ListHeaderComponent={
          <View style={{ gap: space.lg, marginBottom: space.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.serif, fontSize: 28, color: colors.text }}>Deadlines</Text>
              <Pressable
                onPress={() => setAdding(true)}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={20} color={colors.onPrimary} />
              </Pressable>
            </View>
            <SegmentedControl
              accessibilityLabel="Deadline filter"
              value={status}
              onChange={setStatus}
              options={[
                { value: 'open', label: 'Open' },
                { value: 'done', label: 'Done' },
              ]}
            />
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text
            style={{
              fontFamily: fonts.semibold, fontSize: 13, color: section.title === 'Overdue' ? colors.danger : colors.textMuted,
              marginTop: space.md, textTransform: 'uppercase', letterSpacing: 0.6,
            }}
          >
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => (
          <DeadlineRow item={item} now={now} done={status === 'done'} onToggle={toggle} onLongPress={confirmDelete} />
        )}
        ListEmptyComponent={
          <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, textAlign: 'center', marginTop: space.xxl }}>
            {status === 'open' ? 'Nothing due. Enjoy it.' : 'Nothing completed yet.'}
          </Text>
        }
      />
      {adding && <AddDeadlineSheet subjects={subjects} onClose={() => setAdding(false)} onSave={save} />}
    </View>
  );
}