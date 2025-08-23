import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { PrimaryButton, Card } from '@/src/components/UI';
import { researchProductIdeas } from '@/src/services/ai';
import { awardExperience } from '@/src/services/gamification';

export default function Research() {
  const [topic, setTopic] = React.useState('AI Agents');
  const [audience, setAudience] = React.useState('Indie makers');
  const [ideas, setIdeas] = React.useState<any[]>([]);
  const onRun = async () => {
    const results = await researchProductIdeas({ topic, audience });
    setIdeas(results);
    awardExperience(20);
  };
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>AI Product Research</Text>
      <Card>
        <Text>Topic</Text>
        <TextInput value={topic} onChangeText={setTopic} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
        <Text>Audience</Text>
        <TextInput value={audience} onChangeText={setAudience} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
        <View style={{ height: 8 }} />
        <PrimaryButton title="Run Research" onPress={onRun} />
      </Card>
      {ideas.map((idea, idx) => (
        <Card key={idx}>
          <Text style={{ fontWeight: '700' }}>{idea.title}</Text>
          <Text>Demand: {idea.demandScore} · Competition: {idea.competition}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}