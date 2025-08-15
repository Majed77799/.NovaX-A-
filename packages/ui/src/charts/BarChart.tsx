import React from 'react';
import { View } from 'react-native';
const LazyImpl = React.lazy(() => import('./_lazy/BarChartImpl'));

type Props = { data: Array<{ label: string; value: number }>; height?: number };

export default function BarChart(props: Props) {
	return (
		<React.Suspense fallback={<View style={{ height: props.height ?? 200 }} />}> 
			<LazyImpl {...props} />
		</React.Suspense>
	);
}