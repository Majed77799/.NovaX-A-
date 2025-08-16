import { create } from 'zustand';
import { nanoid } from 'nanoid';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  level: number;
  experience: number;
  badges: string[];
  affiliateCode: string;
}

interface UserState {
  user: UserProfile | null;
  login: (name: string, email?: string) => void;
  logout: () => void;
  addExperience: (points: number) => void;
  addBadge: (badge: string) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: { id: nanoid(), name: 'Guest', level: 1, experience: 0, badges: [], affiliateCode: 'AFF-' + nanoid(6) },
  login: (name, email) => set({ user: { id: nanoid(), name, email, level: 1, experience: 0, badges: [], affiliateCode: 'AFF-' + nanoid(6) } }),
  logout: () => set({ user: null }),
  addExperience: (points) => {
    const current = get().user;
    if (!current) return;
    const experience = current.experience + points;
    let level = current.level;
    while (experience >= level * 100) level += 1;
    set({ user: { ...current, experience, level } });
  },
  addBadge: (badge) => {
    const current = get().user;
    if (!current) return;
    set({ user: { ...current, badges: Array.from(new Set([...current.badges, badge])) } });
  },
}));