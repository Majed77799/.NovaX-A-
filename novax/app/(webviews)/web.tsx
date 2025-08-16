import React from 'react';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';

export default function Web() {
  const params = useLocalSearchParams<{ url?: string }>();
  const url = params.url || 'https://example.com';
  return <WebView source={{ uri: String(url) }} style={{ flex: 1 }} />;
}