import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, PrimaryButton } from '@/src/components/UI';
import { useUserStore } from '@/src/stores/userStore';
import { awardBadge, awardExperience, claimReward } from '@/src/services/gamification';

export default function Gamification() {
  const user = useUserStore((s) => s.user);
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Gamification</Text>
      <Card>
        <Text>Level: {user?.level} · XP: {user?.experience}</Text>
        <View style={{ height: 8 }} />
        <PrimaryButton title="Gain 50 XP" onPress={() => awardExperience(50)} />
        <View style={{ height: 8 }} />
        <PrimaryButton title="Earn 'Builder' Badge" onPress={() => awardBadge('Builder')} />
      </Card>
      <Card>
        <Text style={{ fontWeight: '700' }}>Badges</Text>
        <Text>{(user?.badges ?? []).join(', ') || 'None'}</Text>
      </Card>
      <Card>
        <Text style={{ fontWeight: '700' }}>Rewards</Text>
        <PrimaryButton title="Claim Discount" onPress={() => {
          const reward = claimReward('discount');
          alert(`Claimed ${reward.value * 100}% discount`);
        }} />
      </Card>
    </ScrollView>
  );
}