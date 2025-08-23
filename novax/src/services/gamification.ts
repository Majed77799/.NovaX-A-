import { useUserStore } from '@/src/stores/userStore';

export const awardExperience = (points: number) => {
  useUserStore.getState().addExperience(points);
};

export const awardBadge = (badge: string) => {
  useUserStore.getState().addBadge(badge);
};

export const getLeaderboard = () => {
  const current = useUserStore.getState().user;
  return [
    { name: current?.name ?? 'Guest', level: current?.level ?? 1, xp: current?.experience ?? 0 },
    { name: 'Nova Pro', level: 5, xp: 600 },
    { name: 'Speed Builder', level: 3, xp: 250 },
  ];
};

export const claimReward = (type: 'credit' | 'discount') => {
  return { type, value: type === 'credit' ? 10 : 0.1 };
};