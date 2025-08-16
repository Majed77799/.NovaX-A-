import React from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { PrimaryButton, Card } from '@/src/components/UI';
import { useUserStore } from '@/src/stores/userStore';

export default function Onboarding() {
  const login = useUserStore((s) => s.login);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Welcome to NovaX</Text>
      <Card>
        <Text>Name</Text>
        <TextInput value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
        <Text>Email</Text>
        <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
        <View style={{ height: 8 }} />
        <PrimaryButton title="Continue" onPress={() => login(name || 'New User', email)} />
      </Card>
    </ScrollView>
  );
}