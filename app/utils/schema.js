import { uid } from 'uid';

export const notes = {
  noteID: uid(),
  updation_date: new Date().toString(),
  notebook_ref_id: null,
  tagsList: [],
  isPinned: false,
  isReadOnly: false,
  isFavorite: false,
  isLocked: false,
  isTrash: false,
  deletionTimeStamp: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
  title: '',
  body: null,
};

export const notebooks = {
  notebookID: uid(),
  notebookName: '',
  usedInTemplate: false,
};

export const autoNote = {
  autoNoteID: uid(),
  autoNoteName: '',
  titleFormat: '',
  state: 'running',
  noteGenerationPeriod: '1 day',
  noteGenerated: 0,
  autoNoteNotebookID: null,
  lastNoteGenerationTime: new Date().getTime(),
  autoNoteUpdationDate: new Date().toString(),
  template: {
    body: { blocks: [] },
  },
};

export const generationPeriod = [
  { value: '1 hr', label: '1 Hour' },
  { value: '6 hr', label: '6 Hour' },
  { value: '12 hr', label: '12 Hour' },
  { value: '1 day', label: '1 Day' },
  { value: '7 day', label: '7 Day' },
  { value: '1 month', label: '1 Month' },
];
export const state = [
  { value: 'running', label: 'Running' },
  { value: 'paused', label: 'Paused' },
];
