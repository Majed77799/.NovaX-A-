import React from 'react';
import { ScrollView, Text } from 'react-native';
import { Card } from '@/src/components/UI';

export default function Products() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Your Products</Text>
      <Card>
        <Text>No products yet. Generate one from the Generator tab.</Text>
      </Card>
    </ScrollView>
  );
}