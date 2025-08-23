import React from 'react';
import { View, Text, TextInput, ScrollView, Share } from 'react-native';
import { Card, PrimaryButton } from '@/src/components/UI';

export default function Freebie() {
  const [email, setEmail] = React.useState('');
  const [link, setLink] = React.useState<string | null>(null);
  const onGet = async () => {
    setLink('https://novax.example/freebie/ai-checklist.pdf');
  };
  const onShare = async () => {
    if (!link) return;
    await Share.share({ message: `Grab your freebie: ${link}` });
  };
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Freebie Funnel</Text>
      <Card>
        <Text>Email</Text>
        <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
        <View style={{ height: 8 }} />
        <PrimaryButton title="Get Freebie" onPress={onGet} />
      </Card>
      {link && (
        <Card>
          <Text>Your download:</Text>
          <Text selectable>{link}</Text>
          <View style={{ height: 8 }} />
          <PrimaryButton title="Share" onPress={onShare} />
        </Card>
      )}
    </ScrollView>
  );
}