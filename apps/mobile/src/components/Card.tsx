import React from 'react';
import { View, ViewProps } from 'react-native';

export function Card({ children, className = '', ...rest }: ViewProps & { className?: string }) {
	return (
		<View {...rest} className={`card ${className}`}>
			{children}
		</View>
	);
}

export default Card;