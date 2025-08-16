import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { PrimaryButton, Card } from '@/src/components/UI';
import { generateProduct } from '@/src/services/ai';
import { WatermarkedView } from '@/src/components/WatermarkedView';
import { useUserStore } from '@/src/stores/userStore';
import { generateWatermarkLabel } from '@/src/services/watermark';

export default function Generator() {
  const [title, setTitle] = React.useState('AI Launch Checklist');
  const [format, setFormat] = React.useState<'ebook' | 'course' | 'template'>('ebook');
  const [product, setProduct] = React.useState<any>(null);
  const user = useUserStore((s) => s.user);
  const onGenerate = async () => {
    const result = await generateProduct({ title, format });
    setProduct(result);
  };
  const label = generateWatermarkLabel(user?.id ?? 'anon', user?.name);
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>One-Click Product Generator</Text>
      <Card>
        <Text>Title</Text>
        <TextInput value={title} onChangeText={setTitle} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
        <Text>Format</Text>
        <TextInput value={format} onChangeText={(t) => setFormat(t as any)} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
        <View style={{ height: 8 }} />
        <PrimaryButton title="Generate" onPress={onGenerate} />
      </Card>
      {product && (
        <WatermarkedView userLabel={label}>
          <Card>
            <Text style={{ fontWeight: '700' }}>{product.title}</Text>
            <Text>Files: {product.files.length}</Text>
          </Card>
        </WatermarkedView>
      )}
    </ScrollView>
  );
}