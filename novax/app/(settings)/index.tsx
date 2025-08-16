import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, PrimaryButton } from '@/src/components/UI';
import i18n from '@/src/providers/i18n';

export default function Settings() {
  const [lang, setLang] = React.useState(i18n.language);
  const toggle = () => {
    const next = lang === 'en' ? 'es' : 'en';
    i18n.changeLanguage(next);
    setLang(next);
  };
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Settings</Text>
      <Card>
        <Text>Language: {lang}</Text>
        <PrimaryButton title="Toggle Language" onPress={toggle} />
      </Card>
    </ScrollView>
  );
}