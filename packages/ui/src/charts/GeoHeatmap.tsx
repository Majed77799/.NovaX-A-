import React from 'react';
import Svg, { Rect } from 'react-native-svg';
import { View } from 'react-native';

type Cell = { x: number; y: number; intensity: number };

type Props = { cells: Cell[]; width?: number; height?: number };

export default function GeoHeatmap({ cells, width = 320, height = 180 }: Props) {
	return (
		<View style={{ height }}>
			<Svg width={width} height={height}>
				{cells.map((c, i) => (
					<Rect key={i} x={c.x} y={c.y} width={8} height={8} fill={`rgba(94,234,212,${Math.min(1, Math.max(0.1, c.intensity))})`} />
				))}
			</Svg>
		</View>
	);
}