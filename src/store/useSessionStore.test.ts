import { User } from '@/interfaces/user/user.interface';
import { useSessionStore } from './useSessionStore';

describe('usesessionStore', () => {
  it('should have initial state', () => {
    const state = useSessionStore.getState();
    expect(state.session).toBeNull();
  });

  it('should set session correctly', () => {
    const user: User = { _id: '1', email: 'test@example.com' };
    useSessionStore.getState().setSession(user);
    expect(useSessionStore.getState().session).toEqual(user);
  });
});
