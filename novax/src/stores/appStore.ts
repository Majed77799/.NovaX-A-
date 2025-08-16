import { create } from 'zustand';

interface AppState {
  locale: string;
  setLocale: (locale: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>((set) => ({
  locale: 'en',
  setLocale: (locale) => set({ locale }),
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));