import React from 'react';
import { Modal, View, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { radii } from '../tokens/radii';

export function ModalSheet({ visible, onClose, children }) {
	const { colors } = useTheme();
	return (
		<Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
			<Pressable onPress={onClose} style={{ flex: 1, backgroundColor: colors.overlay.strong, justifyContent: 'flex-end' }}>
				<Pressable onPress={() => {}} style={{ backgroundColor: colors.background.soft, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl, padding: 16 }}>
					{children}
				</Pressable>
			</Pressable>
		</Modal>
	);
}