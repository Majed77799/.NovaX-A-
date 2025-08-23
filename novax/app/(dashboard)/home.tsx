import { Link } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { Card, PrimaryButton } from '@/src/components/UI';
import { getLeaderboard } from '@/src/services/gamification';

export default function Home() {
  const leaderboard = getLeaderboard();
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>Dashboard</Text>
      <Card>
        <Text style={{ marginBottom: 8 }}>Quick Actions</Text>
        <Link href="/(research)" asChild>
          <PrimaryButton title="Research new product" />
        </Link>
        <View style={{ height: 8 }} />
        <Link href="/(generator)" asChild>
          <PrimaryButton title="Generate product" />
        </Link>
      </Card>
      <Card>
        <Text style={{ marginBottom: 8 }}>Leaderboard</Text>
        {leaderboard.map((row, idx) => (
          <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
            <Text>{row.name}</Text>
            <Text>Lv {row.level} · {row.xp} XP</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}