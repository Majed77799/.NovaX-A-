import React from 'react';
import { ScrollView, Text } from 'react-native';

export default function Terms() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Terms</Text>
      <Text>By using NovaX you agree to our terms and conditions.</Text>
    </ScrollView>
  );
}