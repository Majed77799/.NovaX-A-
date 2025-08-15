import React from 'react';
import { View } from 'react-native';
const LazyImpl = React.lazy(() => import('./_lazy/BubbleChartImpl'));

type BubblePoint = { x: number; y: number; r: number };

type Props = { data: BubblePoint[]; height?: number };

export default function BubbleChart(props: Props) {
	return (
		<React.Suspense fallback={<View style={{ height: props.height ?? 220 }} />}> 
			<LazyImpl {...props} />
		</React.Suspense>
	);
}