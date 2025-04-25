import { User } from '@/interfaces/user/user.interface';
import { create } from 'zustand';

type State = {
  session: User | null;
};

type Action = {
  setSession: (session: State['session']) => void;
};

export const usesessionStore = create<State & Action>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
}));
