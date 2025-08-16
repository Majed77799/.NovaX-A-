import React from 'react';
import { View, Text } from 'react-native';

export const WatermarkedView = ({ userLabel, children }: { userLabel: string; children: React.ReactNode }) => {
  return (
    <View style={{ position: 'relative' }}>
      {children}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, justifyContent: 'center', alignItems: 'center', opacity: 0.07 }}>
        <Text style={{ fontSize: 48, transform: [{ rotate: '-30deg' }], fontWeight: '700' }}>{userLabel}</Text>
      </View>
    </View>
  );
};