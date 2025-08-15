import React, { useMemo } from 'react';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { View } from 'react-native';

type Datum = { x: number | string; y: number };

type Props = { data: Datum[]; height?: number; color?: string };

export default function TimeSeriesChartImpl({ data, height = 220, color = '#38BDF8' }: Props) {
	const { path, width } = useMemo(() => {
		if (!data || data.length === 0) return { path: '', width: 0 };
		const values = data.map(d => d.y);
		const max = Math.max(...values);
		const min = Math.min(...values);
		const chartWidth = Math.max(300, data.length * 12);
		const stepX = chartWidth / Math.max(1, data.length - 1);
		let d = '';
		data.forEach((point, index) => {
			const x = index * stepX;
			const y = height - ((point.y - min) / (max - min || 1)) * height;
			d += index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
		});
		return { path: d, width: chartWidth };
	}, [data, height]);

	return (
		<View style={{ height }}>
			<Svg width={width} height={height}>
				<Defs>
					<SvgLinearGradient id="line" x1="0%" y1="0%" x2="0%" y2="100%">
						<Stop offset="0%" stopColor={color} stopOpacity="0.9" />
						<Stop offset="100%" stopColor={color} stopOpacity="0.2" />
					</SvgLinearGradient>
				</Defs>
				<Path d={path} stroke={color} fill="none" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
			</Svg>
		</View>
	);
}