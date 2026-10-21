import Storage from 'expo-sqlite/kv-store';

const KEY = 'notes:lastSubjectId';

export function getLastSubjectId(): number | null {
  const value = Storage.getItemSync(KEY);
  return value ? Number(value) : null;
}

export function setLastSubjectId(id: number): void {
  Storage.setItemSync(KEY, String(id));
}