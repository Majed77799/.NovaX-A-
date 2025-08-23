import React from 'react';
import { ScrollView, Text, Pressable } from 'react-native';
import { Card } from '@/src/components/UI';
import { useUserStore } from '@/src/stores/userStore';
import { useSocialStore } from '@/src/services/social';
import * as WebBrowser from 'expo-web-browser';

export default function Marketplace() {
  const user = useUserStore((s) => s.user);
  const getAffiliateUrl = useSocialStore((s) => s.getAffiliateUrl);
  const products = [
    { id: 'p1', title: 'AI Launch Checklist' },
    { id: 'p2', title: 'Agentic Product Templates' },
  ];
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Affiliate Marketplace</Text>
      {products.map((p) => {
        const url = getAffiliateUrl(p.id, user?.affiliateCode ?? 'AFF');
        return (
          <Card key={p.id}>
            <Text style={{ fontWeight: '700' }}>{p.title}</Text>
            <Pressable onPress={() => WebBrowser.openBrowserAsync(url)}>
              <Text style={{ color: '#4f46e5' }}>Get link</Text>
            </Pressable>
          </Card>
        );
      })}
    </ScrollView>
  );
}