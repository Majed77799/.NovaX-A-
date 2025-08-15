import React from 'react';
import Svg, { Polyline, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

interface Props {
	data: number[];
	width?: number;
	height?: number;
	color?: string;
}

export default function Sparkline({ data, width = 140, height = 48, color = '#5EEAD4' }: Props) {
	if (!data || data.length === 0) return null;
	const max = Math.max(...data);
	const min = Math.min(...data);
	const points = data.map((v, i) => {
		const x = (i / (data.length - 1)) * width;
		const y = height - ((v - min) / (max - min || 1)) * height;
		return `${x},${y}`;
	}).join(' ');

	return (
		<Svg width={width} height={height}>
			<Defs>
				<SvgLinearGradient id="glow" x1="0%" y1="0%" x2="0%" y2="100%">
					<Stop offset="0%" stopColor={color} stopOpacity="0.8" />
					<Stop offset="100%" stopColor={color} stopOpacity="0.1" />
				</SvgLinearGradient>
			</Defs>
			<Polyline
				points={points}
				fill="none"
				stroke={color}
				strokeWidth={2}
				strokeLinejoin="round"
				strokeLinecap="round"
			/>
		</Svg>
	);
}