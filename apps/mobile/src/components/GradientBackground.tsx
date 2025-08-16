import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { ViewProps } from 'react-native';

export default function GradientBackground({ children, style, ...rest }: ViewProps) {
	return (
		<LinearGradient colors={["#F6E7FF","#E9F0FF","#D7F7FF"]} start={{x:0,y:0}} end={{x:1,y:1}} style={[{ flex: 1 }, style]} {...rest}>
			{children}
		</LinearGradient>
	);
}