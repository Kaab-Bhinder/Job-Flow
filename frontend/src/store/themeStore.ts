import { create } from 'zustand';

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
  setTheme: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: (() => {
    const stored = localStorage.getItem('jobflow-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  })(),
  toggle: () =>
    set((state) => {
      const next = !state.isDark;
      localStorage.setItem('jobflow-theme', next ? 'dark' : 'light');
      document.documentElement.classList.toggle('light', !next);
      return { isDark: next };
    }),
  setTheme: (dark: boolean) =>
    set(() => {
      localStorage.setItem('jobflow-theme', dark ? 'dark' : 'light');
      document.documentElement.classList.toggle('light', !dark);
      return { isDark: dark };
    }),
}));
