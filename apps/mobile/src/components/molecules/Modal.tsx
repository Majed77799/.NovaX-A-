import React from 'react';
import { Modal as RNModal, View, Pressable } from 'react-native';
import { useTheme } from '../../theme';

export type ModalProps = {
	visible: boolean;
	onClose: () => void;
	children: React.ReactNode;
};

export function Modal({ visible, onClose, children }: ModalProps) {
	const { tokens } = useTheme();
	return (
		<RNModal visible={visible} transparent animationType="fade">
			<Pressable onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: tokens.spacing.lg }}>
				<Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: tokens.colors.surface, borderRadius: tokens.radii.lg, borderWidth: 1, borderColor: tokens.colors.border, padding: tokens.spacing.lg, width: '100%' }}>
					{children}
				</Pressable>
			</Pressable>
		</RNModal>
	);
}