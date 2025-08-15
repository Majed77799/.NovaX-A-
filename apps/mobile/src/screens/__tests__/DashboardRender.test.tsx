import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Dashboard from '../../screens/Dashboard';

jest.mock('../../lib/analytics', () => ({
	getSummary: jest.fn(async () => ({ totalProducts: 1, totalExports: 2, totalAiMessages: 3, totalSalesCount: 4, totalSalesAmount: 5 })),
	getTimeSeries: jest.fn(async () => []),
	recordEvent: jest.fn(async () => ({}))
}));

jest.mock('../../lib/remoteSales', () => ({
	fetchStripeSalesSummary: jest.fn(async () => null)
}));

it('renders charts and stats containers', async () => {
	const { getByText } = render(<Dashboard />);
	await waitFor(() => {
		expect(getByText('Sales Performance')).toBeTruthy();
		expect(getByText('AI Usage')).toBeTruthy();
		expect(getByText('Sales by Channel')).toBeTruthy();
	});
});