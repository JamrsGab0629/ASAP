export const DEFAULT_LESSON = 'Lesson 1';
const MAX_LENGTH = 60;

export const cleanLesson = (raw: string) => raw.replace(/\s+/g, ' ').trim().slice(0, MAX_LENGTH);