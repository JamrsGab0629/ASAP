import { NewNoteMenu } from '@/features/notes/components/NewNoteMenu';
import { PHOTO_SOURCES, type PhotoSource } from '../photoSources';

type Props = { visible: boolean; onClose: () => void; onPick: (source: PhotoSource) => void };

export function PhotoSourceMenu({ visible, onClose, onPick }: Props) {
  const options = PHOTO_SOURCES.map((s) => ({ key: s.key, label: s.label, hint: s.hint, icon: s.icon, onPress: () => onPick(s) }));
  return <NewNoteMenu visible={visible} options={options} onClose={onClose} />;
}