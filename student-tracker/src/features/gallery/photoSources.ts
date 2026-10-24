import { Camera, Images, type LucideIcon } from 'lucide-react-native';
import { pickFromLibrary, takePhotos } from './pickPhotos';
import type { PickedPhoto } from './types';

export type PhotoSource = { key: string; label: string; hint: string; icon: LucideIcon; pick: () => Promise<PickedPhoto[]> };

export const PHOTO_SOURCES: PhotoSource[] = [
  { key: 'library', label: 'Choose from gallery', hint: 'Select many photos at once', icon: Images, pick: pickFromLibrary },
  { key: 'camera', label: 'Take photos', hint: 'Snap one page after another', icon: Camera, pick: takePhotos },
];