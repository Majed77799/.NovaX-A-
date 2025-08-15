import React, { useMemo } from 'react';
import Svg, { Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { View } from 'react-native';

type Props = { data: Array<{ label: string; value: number }>; height?: number; color?: string };

export default function BarChartImpl({ data, height = 220, color = '#A78BFA' }: Props) {
	const { width, bars } = useMemo(() => {
		const maxVal = Math.max(1, ...data.map(d => d.value));
		const barWidth = 20;
		const gap = 12;
		const chartWidth = data.length * (barWidth + gap) + gap;
		const bars = data.map((d, i) => {
			const h = (d.value / maxVal) * (height - 20);
			const x = gap + i * (barWidth + gap);
			const y = height - h;
			return { x, y, h };
		});
		return { width: chartWidth, bars };
	}, [data, height]);

	return (
		<View style={{ height }}>
			<Svg width={width} height={height}>
				<Defs>
					<SvgLinearGradient id="bar" x1="0%" y1="0%" x2="0%" y2="100%">
						<Stop offset="0%" stopColor={color} stopOpacity="0.9" />
						<Stop offset="100%" stopColor={color} stopOpacity="0.5" />
					</SvgLinearGradient>
				</Defs>
				{bars.map((b, idx) => (
					<Rect key={idx} x={b.x} y={b.y} width={20} height={b.h} fill={color} rx={6} />
				))}
			</Svg>
		</View>
	);
}