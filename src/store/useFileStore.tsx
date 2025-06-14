import { File } from '@/interfaces/explorer/file/file.interface';
import { FileStatusEnum } from '@/lib/constants/files.enum';
import { create } from 'zustand';

type State = {
  file: File;
};

type Action = {
  setFile: (file: State['file']) => void;
};

export const useFileStore = create<State & Action>((set) => ({
  file: {
    _id: '',
    filename: '',
    ref: '',
    size: 0,
    compressedSize: 0,
    status: FileStatusEnum.RAW,
  },
  setFile: (file) => set({ file }),
}));
