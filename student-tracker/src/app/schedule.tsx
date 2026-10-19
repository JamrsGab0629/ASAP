
import { useSQLiteContext } from 'expo-sqlite';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { fonts, space } from '@/constants/theme';
import { formatLongDate, toISODate } from '@/lib/dates';
import { useTheme } from '@/theme';
import type { ScheduledClass } from '@/features/schedule/classesForDate';
import { AddClassSheet } from '@/features/schedule/components/AddClassSheet';
import { ClassRow } from '@/features/schedule/components/ClassRow';
import { WeekStrip } from '@/features/schedule/components/WeekStrip';
import { addClass, cancelOnDate, deleteSchedule } from '@/features/schedule/scheduleMutations';
import { listSubjectOptions } from '@/lib/subjectOptions';
import type { ClassDraft, SubjectOption } from '@/features/schedule/types';
import { useDayClasses } from '@/features/schedule/useDayClasses';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const db = useSQLiteContext();
  const [today] = useState(() => new Date());
  const [selected, setSelected] = useState(today);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [adding, setAdding] = useState(false);
  const { classes, reload } = useDayClasses(selected);

  useEffect(() => {
    listSubjectOptions(db).then(setSubjects);
  }, [db, adding]);

  const save = async (draft: ClassDraft) => {
    await addClass(db, draft);
    setAdding(false);
    reload();
  };

  const run = (action: () => Promise<void>) => async () => {
    await action();
    reload();
  };

  const openActions = (item: ScheduledClass) => {
    const iso = toISODate(selected);
    const buttons = item.isMakeup
      ? [{ text: 'Delete makeup class', style: 'destructive' as const, onPress: run(() => deleteSchedule(db, item.scheduleId)) }]
      : [
          { text: 'Cancel on this date', onPress: run(() => cancelOnDate(db, item.scheduleId, iso)) },
          { text: 'Remove from weekly schedule', style: 'destructive' as const, onPress: run(() => deleteSchedule(db, item.scheduleId)) },
        ];
    Alert.alert(item.subjectName, undefined, [...buttons, { text: 'Close', style: 'cancel' }]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
     
      <FlatList
        data={classes}
        keyExtractor={(c) => String(c.scheduleId)}
        contentContainerStyle={{ padding: space.xl, paddingTop: insets.top + space.lg, gap: space.md }}
        ListHeaderComponent={
          <View style={{ gap: space.lg, marginBottom: space.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.serif, fontSize: 28, color: colors.text }}>Schedule</Text>
              <Pressable
                onPress={() => setAdding(true)}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={20} color={colors.onPrimary} />
              </Pressable>
            </View>
            <WeekStrip selected={selected} today={today} onSelect={setSelected} />
            <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.textMuted }}>
              {formatLongDate(selected)}
            </Text>
          </View>
        }
        renderItem={({ item }) => <ClassRow item={item} onLongPress={openActions} />}
        ListEmptyComponent={
          <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, textAlign: 'center', marginTop: space.xxl }}>
            No classes on this day.
          </Text>
        }
      />
      <AddClassSheet
        visible={adding}
        subjects={subjects}
        initialDate={selected}
        onClose={() => setAdding(false)}
        onSave={save}
      />
    </View>
  );
}