import React from 'react';
import { Text, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { PrimaryButton } from '@/src/components/UI';

export default function MarketingIndex() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Marketing</Text>
      <Link href="/(marketing)/copilot" asChild>
        <PrimaryButton title="Open Copilot" />
      </Link>
    </ScrollView>
  );
}