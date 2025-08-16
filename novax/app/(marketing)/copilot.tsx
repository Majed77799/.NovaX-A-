import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { PrimaryButton, Card } from '@/src/components/UI';
import { marketingCopilot } from '@/src/services/ai';

export default function Copilot() {
  const [title, setTitle] = React.useState('AI Launch Checklist');
  const [outputs, setOutputs] = React.useState<any>(null);
  const onRun = async () => {
    const result = await marketingCopilot({ productTitle: title });
    setOutputs(result);
  };
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>AI Marketing Copilot</Text>
      <Card>
        <Text>Product Title</Text>
        <TextInput value={title} onChangeText={setTitle} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
        <View style={{ height: 8 }} />
        <PrimaryButton title="Generate Marketing" onPress={onRun} />
      </Card>
      {outputs && (
        <Card>
          <Text style={{ fontWeight: '700' }}>Ad Copy</Text>
          <Text>{outputs.adCopy}</Text>
          <Text style={{ fontWeight: '700', marginTop: 8 }}>Email</Text>
          <Text>{outputs.email}</Text>
          <Text style={{ fontWeight: '700', marginTop: 8 }}>Tweets</Text>
          {outputs.tweets.map((t: string, idx: number) => (
            <Text key={idx}>• {t}</Text>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}