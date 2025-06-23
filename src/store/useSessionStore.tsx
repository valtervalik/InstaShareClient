import { User } from '@/interfaces/user/user.interface';
import { create } from 'zustand';

type State = {
  session: User | null;
  token: string | null;
};

type Action = {
  setSession: (session: State['session']) => void;
  setToken: (token: State['token']) => void;
};

export const useSessionStore = create<State & Action>((set) => ({
  session: null,
  token: null,
  setSession: (session) => set({ session }),
  setToken: (token) => set({ token }),
}));
