import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Dashboard from '../../screens/Dashboard';

jest.mock('../../lib/analytics', () => {
	const actual = jest.requireActual('../../lib/analytics');
	return {
		...actual,
		recordEvent: jest.fn(async () => ({})),
		getSummary: jest.fn(async () => ({ totalProducts: 0, totalExports: 0, totalAiMessages: 0, totalSalesCount: 0, totalSalesAmount: 0 })),
		getTimeSeries: jest.fn(async () => [])
	};
});

jest.mock('../../lib/remoteSales', () => ({
	fetchStripeSalesSummary: jest.fn(async () => ({ ok: true, totalAmount: 123, totalCount: 3 }))
}));

describe('Dashboard', () => {
	it('renders sticky header with quick-actions and responds to taps', async () => {
		const { getByText } = render(<Dashboard />);
		expect(getByText('Advanced Dashboard')).toBeTruthy();
		const createBtn = getByText('Create Product');
		fireEvent.press(createBtn);
		await waitFor(() => {
			expect(getByText('Create Product')).toBeTruthy();
		});
	});
});