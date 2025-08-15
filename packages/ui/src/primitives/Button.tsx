import React from 'react';
import { Pressable, Text, ViewStyle, StyleSheet } from 'react-native';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export const Button: React.FC<ButtonProps> = ({ label, onPress, style }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.base, pressed && styles.pressed, style]}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#111827',
    borderRadius: 8,
    alignItems: 'center'
  },
  pressed: { opacity: 0.85 },
  label: { color: '#fff', fontSize: 16 }
});