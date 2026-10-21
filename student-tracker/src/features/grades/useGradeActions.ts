import { useSQLiteContext } from 'expo-sqlite';
import { Alert } from 'react-native';
import {
  addComponent, addComponentsFromPreset, addItem, addPeriod, addPeriodsFromPreset,
  deleteComponent, deleteItem, deletePeriod, updateComponent, updateItem, updatePeriod,
} from './gradeMutations';
import type { Preset } from './presets';
import type { ComponentDraft, GradeComponent, GradeItem, GradePeriod, ItemDraft, PeriodDraft } from './types';

/** Every write the Grades screen can make, each followed by a reload. */
export function useGradeActions(reload: () => void) {
  const db = useSQLiteContext();

  const run = async (write: () => Promise<void>) => {
    await write();
    reload();
  };

  const confirmDelete = (title: string, message: string, write: () => Promise<void>) =>
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => run(write) },
    ]);

  return {
    savePeriod: (initial: GradePeriod | null, d: PeriodDraft) =>
      run(() => (initial ? updatePeriod(db, initial.id, d) : addPeriod(db, d))),
    saveComponent: (initial: GradeComponent | null, d: ComponentDraft) =>
      run(() => (initial ? updateComponent(db, initial.id, d) : addComponent(db, d))),
    saveItem: (initial: GradeItem | null, d: ItemDraft) =>
      run(() => (initial ? updateItem(db, initial.id, d) : addItem(db, d))),
    applyPeriodPreset: (subjectId: number, preset: Preset) => run(() => addPeriodsFromPreset(db, subjectId, preset)),
    applyComponentPreset: (periodId: number, preset: Preset) => run(() => addComponentsFromPreset(db, periodId, preset)),
    removePeriod: (p: GradePeriod) =>
      confirmDelete(`Delete ${p.name}?`, 'All its parts and items will be deleted too.', () => deletePeriod(db, p.id)),
    removeComponent: (c: GradeComponent) =>
      confirmDelete(`Delete ${c.name}?`, `Its ${c.items.length} item(s) will be deleted too.`, () => deleteComponent(db, c.id)),
    removeItem: (item: GradeItem) => confirmDelete(item.title, 'Delete this item?', () => deleteItem(db, item.id)),
  };
}