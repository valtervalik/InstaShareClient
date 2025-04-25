import { FileCategory } from '@/interfaces/explorer/file-category/file-category.interface';
import { create } from 'zustand';

type State = {
  fileCategory: FileCategory | null;
};

type Action = {
  setFileCategory: (fileCategory: State['fileCategory']) => void;
};

export const useFileCategoryStore = create<State & Action>((set) => ({
  fileCategory: null,
  setFileCategory: (fileCategory) => set({ fileCategory }),
}));
