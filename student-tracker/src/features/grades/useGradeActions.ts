import { useSQLiteContext } from 'expo-sqlite';
import { Alert } from 'react-native';
import {
  addComponent, addComponentsFromPreset, addItem, deleteComponent, deleteItem, updateComponent, updateItem,
} from './gradeMutations';
import type { ComponentPreset } from './presets';
import type { ComponentDraft, GradeComponent, GradeItem, ItemDraft } from './types';

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
    saveComponent: (initial: GradeComponent | null, d: ComponentDraft) =>
      run(() => (initial ? updateComponent(db, initial.id, d) : addComponent(db, d))),
    saveItem: (initial: GradeItem | null, d: ItemDraft) =>
      run(() => (initial ? updateItem(db, initial.id, d) : addItem(db, d))),
    applyPreset: (subjectId: number, preset: ComponentPreset) =>
      run(() => addComponentsFromPreset(db, subjectId, preset)),
    removeComponent: (c: GradeComponent) =>
      confirmDelete(`Delete ${c.name}?`, `Its ${c.items.length} item(s) will be deleted too.`, () => deleteComponent(db, c.id)),
    removeItem: (item: GradeItem) =>
      confirmDelete(item.title, 'Delete this item?', () => deleteItem(db, item.id)),
  };
}