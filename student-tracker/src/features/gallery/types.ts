export type PickedPhoto = { uri: string; width: number | null };

export type Photo = {
  id: number;
  subjectId: number;
  subjectName: string;
  subjectColor: string;
  lesson: string;
  filePath: string; // relative to the documents folder
  thumbPath: string;
  position: number;
};

export type Album = {
  key: string;
  subjectId: number;
  subjectName: string;
  subjectColor: string;
  lesson: string;
  photos: Photo[];
};

export type Destination = { subjectId: number; lesson: string };
export type SaveProgress = { done: number; total: number };