import type { Album, Photo } from './types';

const byName = (a: Album, b: Album) =>
  a.subjectName.localeCompare(b.subjectName) || a.lesson.localeCompare(b.lesson, undefined, { numeric: true });

/** Photos (already in order) -> albums, one per subject and lesson, sorted by subject then lesson. */
export function groupAlbums(photos: Photo[]): Album[] {
  const albums = new Map<string, Album>();
  for (const photo of photos) {
    const key = `${photo.subjectId}|${photo.lesson}`;
    const album = albums.get(key);
    if (album) album.photos.push(photo);
    else {
      albums.set(key, {
        key,
        subjectId: photo.subjectId,
        subjectName: photo.subjectName,
        subjectColor: photo.subjectColor,
        lesson: photo.lesson,
        photos: [photo],
      });
    }
  }
  return [...albums.values()].sort(byName);
}