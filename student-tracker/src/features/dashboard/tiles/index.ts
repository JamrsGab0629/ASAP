import type { TileProvider } from '../types';
import { allowanceTile } from './allowanceTile';
import { deadlinesTile } from './deadlinesTile';
import { flashcardsTile } from './flashcardsTile';
import { gradesTile } from './gradesTile';
import { notesTile } from './notesTile';
import { scheduleTile } from './scheduleTile';
import { subjectsTile } from './subjectsTile';

export const tileProviders: TileProvider[] = [
  subjectsTile,
  scheduleTile,
  deadlinesTile,
  allowanceTile,
  notesTile,
  flashcardsTile,
  gradesTile
];