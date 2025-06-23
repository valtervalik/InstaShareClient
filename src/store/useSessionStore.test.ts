import { User } from '@/interfaces/user/user.interface';
import { useSessionStore } from './useSessionStore';

describe('useSessionStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useSessionStore.setState({ session: null, token: null });
  });

  describe('initial state', () => {
    it('should have session as null', () => {
      const state = useSessionStore.getState();
      expect(state.session).toBeNull();
    });

    it('should have token as null', () => {
      const state = useSessionStore.getState();
      expect(state.token).toBeNull();
    });
  });

  describe('setSession', () => {
    it('should set session correctly', () => {
      const user: User = { _id: '1', email: 'test@example.com' };
      useSessionStore.getState().setSession(user);
      expect(useSessionStore.getState().session).toEqual(user);
    });

    it('should set session to null', () => {
      const user: User = { _id: '1', email: 'test@example.com' };
      useSessionStore.getState().setSession(user);
      expect(useSessionStore.getState().session).toEqual(user);

      useSessionStore.getState().setSession(null);
      expect(useSessionStore.getState().session).toBeNull();
    });

    it('should update session with different user', () => {
      const user1: User = { _id: '1', email: 'user1@example.com' };
      const user2: User = { _id: '2', email: 'user2@example.com' };

      useSessionStore.getState().setSession(user1);
      expect(useSessionStore.getState().session).toEqual(user1);

      useSessionStore.getState().setSession(user2);
      expect(useSessionStore.getState().session).toEqual(user2);
    });
  });

  describe('setToken', () => {
    it('should set token correctly', () => {
      const token = 'bearer-token-123';
      useSessionStore.getState().setToken(token);
      expect(useSessionStore.getState().token).toBe(token);
    });

    it('should set token to null', () => {
      const token = 'bearer-token-123';
      useSessionStore.getState().setToken(token);
      expect(useSessionStore.getState().token).toBe(token);

      useSessionStore.getState().setToken(null);
      expect(useSessionStore.getState().token).toBeNull();
    });

    it('should update token with different value', () => {
      const token1 = 'bearer-token-123';
      const token2 = 'bearer-token-456';

      useSessionStore.getState().setToken(token1);
      expect(useSessionStore.getState().token).toBe(token1);

      useSessionStore.getState().setToken(token2);
      expect(useSessionStore.getState().token).toBe(token2);
    });
  });

  describe('combined operations', () => {
    it('should set both session and token independently', () => {
      const user: User = { _id: '1', email: 'test@example.com' };
      const token = 'bearer-token-123';

      useSessionStore.getState().setSession(user);
      useSessionStore.getState().setToken(token);

      const state = useSessionStore.getState();
      expect(state.session).toEqual(user);
      expect(state.token).toBe(token);
    });

    it('should clear session without affecting token', () => {
      const user: User = { _id: '1', email: 'test@example.com' };
      const token = 'bearer-token-123';

      useSessionStore.getState().setSession(user);
      useSessionStore.getState().setToken(token);

      useSessionStore.getState().setSession(null);

      const state = useSessionStore.getState();
      expect(state.session).toBeNull();
      expect(state.token).toBe(token);
    });

    it('should clear token without affecting session', () => {
      const user: User = { _id: '1', email: 'test@example.com' };
      const token = 'bearer-token-123';

      useSessionStore.getState().setSession(user);
      useSessionStore.getState().setToken(token);

      useSessionStore.getState().setToken(null);

      const state = useSessionStore.getState();
      expect(state.session).toEqual(user);
      expect(state.token).toBeNull();
    });
  });
});
