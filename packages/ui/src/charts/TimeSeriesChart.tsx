import React from 'react';
import { View } from 'react-native';

const LazyImpl = React.lazy(() => import('./_lazy/TimeSeriesChartImpl'));

type Props = { data: Array<{ x: number | string; y: number }> };

export default function TimeSeriesChart(props: Props) {
	return (
		<React.Suspense fallback={<View style={{ height: 200 }} />}> 
			<LazyImpl {...props} />
		</React.Suspense>
	);
}