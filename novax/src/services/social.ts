import { create } from 'zustand';
import { nanoid } from 'nanoid';

interface SocialPost {
  id: string;
  content: string;
  likes: number;
  shares: number;
  authorId: string;
}

interface SocialState {
  posts: SocialPost[];
  like: (id: string) => void;
  share: (id: string) => void;
  createPost: (content: string, authorId: string) => void;
  getAffiliateUrl: (productId: string, affiliateCode: string) => string;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  posts: [],
  like: (id) => set({ posts: get().posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)) }),
  share: (id) => set({ posts: get().posts.map((p) => (p.id === id ? { ...p, shares: p.shares + 1 } : p)) }),
  createPost: (content, authorId) => set({ posts: [{ id: nanoid(), content, likes: 0, shares: 0, authorId }, ...get().posts] }),
  getAffiliateUrl: (productId, affiliateCode) => `https://novax.example/products/${productId}?ref=${affiliateCode}`,
}));