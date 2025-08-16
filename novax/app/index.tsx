import { Link } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';
import { PrimaryButton } from '@/src/components/UI';

export default function Index() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>NovaX</Text>
      <Text>AI Product Studio: research, generate, market, and monetize.</Text>

      <Link href="/(dashboard)/home" asChild>
        <PrimaryButton title="Go to Dashboard" />
      </Link>
      <Link href="/(research)" asChild>
        <PrimaryButton title="AI Product Research" />
      </Link>
      <Link href="/(generator)" asChild>
        <PrimaryButton title="One-Click Product Generator" />
      </Link>
      <Link href="/(marketing)/copilot" asChild>
        <PrimaryButton title="AI Marketing Copilot" />
      </Link>
      <Link href="/(funnel)/freebie" asChild>
        <PrimaryButton title="Freebie Funnel" />
      </Link>
      <Link href="/(payments)/checkout" asChild>
        <PrimaryButton title="Payments" />
      </Link>
      <Link href="/(social)" asChild>
        <PrimaryButton title="Social Layer" />
      </Link>
      <Link href="/(gamification)" asChild>
        <PrimaryButton title="Gamification" />
      </Link>
      <Link href="/(settings)" asChild>
        <PrimaryButton title="Settings" />
      </Link>
    </ScrollView>
  );
}