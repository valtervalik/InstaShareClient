import { User } from '@/interfaces/user/user.interface';
import { usesessionStore } from './useSessionStore';

describe('usesessionStore', () => {
  it('should have initial state', () => {
    const state = usesessionStore.getState();
    expect(state.session).toBeNull();
  });

  it('should set session correctly', () => {
    const user: User = { _id: '1', email: 'test@example.com' };
    usesessionStore.getState().setSession(user);
    expect(usesessionStore.getState().session).toEqual(user);
  });
});
