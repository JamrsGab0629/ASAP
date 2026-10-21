import { useSQLiteContext } from 'expo-sqlite';
import { Alert } from 'react-native';
import { setAllowance } from './budgetPlan';
import { addEntry, deleteEntry, updateEntry } from './entryMutations';
import type { PeriodType } from './period';
import type { Entry, EntryDraft } from './types';

export function useAllowanceActions(reload: () => void) {
  const db = useSQLiteContext();

  const run = async (write: () => Promise<void>) => {
    await write();
    reload();
  };

  return {
    saveEntry: (initial: Entry | null, d: EntryDraft) => run(() => (initial ? updateEntry(db, initial.id, d) : addEntry(db, d))),
    saveAllowance: (type: PeriodType, amount: number) => run(() => setAllowance(db, type, amount, new Date())),
    removeEntry: (entry: Entry) =>
      Alert.alert(entry.note ?? entry.category ?? 'Entry', 'Delete this entry?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => run(() => deleteEntry(db, entry.id)) },
      ]),
  };
}