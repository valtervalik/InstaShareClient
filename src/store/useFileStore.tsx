import { File } from '@/interfaces/explorer/file/file.interface';
import { create } from 'zustand';

type State = {
  file: File;
  jobId: string | null;
};

type Action = {
  setFile: (file: State['file']) => void;
  setJobId: (status: State['jobId']) => void;
};

export const useFileStore = create<State & Action>((set) => ({
  file: { _id: '', filename: '', ref: '', size: 0, compressedSize: 0 },
  jobId: null,
  setFile: (file) => set({ file }),
  setJobId: (jobId) => set({ jobId }),
}));
