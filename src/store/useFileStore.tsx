import { File } from '@/interfaces/explorer/file/file.interface';
import { create } from 'zustand';

type State = {
  file: File;
};

type Action = {
  setFile: (file: State['file']) => void;
};

export const useFileStore = create<State & Action>((set) => ({
  file: { _id: '', filename: '', ref: '', size: 0, compressedSize: 0 },
  setFile: (file) => set({ file }),
}));
