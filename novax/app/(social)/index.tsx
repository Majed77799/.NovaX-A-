import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { PrimaryButton, Card } from '@/src/components/UI';
import { useSocialStore } from '@/src/services/social';
import { useUserStore } from '@/src/stores/userStore';

export default function Social() {
  const { posts, like, share, createPost } = useSocialStore();
  const user = useUserStore((s) => s.user);
  const [content, setContent] = React.useState('Launching my new product!');
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Social</Text>
      <Card>
        <Text>New Post</Text>
        <TextInput value={content} onChangeText={setContent} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
        <View style={{ height: 8 }} />
        <PrimaryButton title="Post" onPress={() => createPost(content, user?.id ?? 'anon')} />
      </Card>
      {posts.map((p) => (
        <Card key={p.id}>
          <Text>{p.content}</Text>
          <Text>Likes: {p.likes} · Shares: {p.shares}</Text>
          <View style={{ height: 8 }} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <PrimaryButton title="Like" onPress={() => like(p.id)} />
            <PrimaryButton title="Share" onPress={() => share(p.id)} />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}