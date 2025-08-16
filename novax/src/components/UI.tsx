import React from 'react';
import { Pressable, Text, View } from 'react-native';

export const PrimaryButton = ({ title, onPress }: { title: string; onPress?: () => void }) => (
  <Pressable onPress={onPress} style={{ backgroundColor: '#4f46e5', padding: 12, borderRadius: 10, alignItems: 'center' }}>
    <Text style={{ color: 'white', fontWeight: '600' }}>{title}</Text>
  </Pressable>
);

export const Card = ({ children }: { children: React.ReactNode }) => (
  <View style={{ backgroundColor: 'white', padding: 12, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 }}>
    {children}
  </View>
);