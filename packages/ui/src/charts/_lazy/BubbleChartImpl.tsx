import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { View } from 'react-native';

type BubblePoint = { x: number; y: number; r: number };

type Props = { data: BubblePoint[]; width?: number; height?: number; color?: string };

export default function BubbleChartImpl({ data, width = 300, height = 220, color = '#F472B6' }: Props) {
	return (
		<View style={{ height }}>
			<Svg width={width} height={height}>
				{data.map((d, i) => (
					<Circle key={i} cx={d.x} cy={height - d.y} r={d.r} fill={color} opacity={0.7} />
				))}
			</Svg>
		</View>
	);
}