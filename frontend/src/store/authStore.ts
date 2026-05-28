import { create } from 'zustand';
import type { User } from '../lib/mockData';
import { api } from '../lib/api';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ needsVerification?: boolean; verifyUrl?: string }>;
  forgotPassword: (email: string) => Promise<{ sent?: boolean; message?: string; resetUrl?: string; reason?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success?: boolean }>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (username: string, password: string) => {
    set({ isLoading: true });
    try {
      const body = new URLSearchParams();
      body.append('username', username);
      body.append('password', password);
      const res = await fetch('http://127.0.0.1:8000/auth/login', { method: 'POST', body });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Login failed');
      }
      const data = await res.json();
      api.setToken(data.access_token);
      // set a minimal user object; backend currently doesn't provide /me
      // fetch real user profile if available
      try {
        const me = await api.get('/auth/me');
        set({ user: me, isAuthenticated: true, isLoading: false });
        // refresh saved jobs for this user
        const loadJobs = (await import('./jobStore')).useJobStore.getState().loadJobs;
        loadJobs?.();
      } catch (e) {
        set({ user: { id: username, email: '', fullName: '', avatarUrl: '' }, isAuthenticated: true, isLoading: false });
      }
    } catch (e) {
      console.error('Login error', e);
      set({ isLoading: false });
      throw e;
    }
  },
  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      // use email as stable user id and include fullName
      const response = await api.post('/auth/register', { id: email, email, fullName: name, password });
      set({ isLoading: false });
      return response;
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },
  forgotPassword: async (email: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/forgot-password', { email });
      set({ isLoading: false });
      return response;
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },
  resetPassword: async (token: string, newPassword: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/reset-password', { token, password: newPassword });
      set({ isLoading: false });
      return response;
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },
  logout: () => {
    api.clearToken();
    set({ user: null, isAuthenticated: false });
  },
}));
