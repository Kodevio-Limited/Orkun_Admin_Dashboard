import { LoginPayload, AuthUser } from './types';

/**
 * Local demo credentials. Authentication is currently handled entirely in the
 * browser so the dashboard can be used without a running backend.
 */
export const DEMO_ACCOUNT = {
  email: 'admin@example.com',
  password: 'admin123',
  name: 'Admin User',
} as const;

const AUTH_USER_KEY = 'auth_user';

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

function storeUser(user: AuthUser, remember?: boolean) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  if (remember) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthUser> {
    await delay();

    const emailMatches =
      payload.email.trim().toLowerCase() === DEMO_ACCOUNT.email.toLowerCase();
    const passwordMatches = payload.password === DEMO_ACCOUNT.password;

    if (!emailMatches || !passwordMatches) {
      throw new Error('Invalid email or password');
    }

    const authUser: AuthUser = {
      id: 'demo-admin',
      name: DEMO_ACCOUNT.name,
      email: DEMO_ACCOUNT.email,
      role: 'superadmin',
      token: 'demo-token',
    };

    storeUser(authUser, payload.remember);
    return authUser;
  },

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_USER_KEY);
      sessionStorage.removeItem(AUTH_USER_KEY);
    }
    return true;
  },

  getStoredUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const stored = sessionStorage.getItem(AUTH_USER_KEY) || localStorage.getItem(AUTH_USER_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  },
};
