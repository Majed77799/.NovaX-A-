import { getSummary, getTimeSeries, recordEvent } from '../../lib/analytics';

describe('analytics lib', () => {
	it('aggregates counts in summary', async () => {
		await recordEvent({ type: 'product_created' });
		await recordEvent({ type: 'exported' });
		await recordEvent({ type: 'ai_user' });
		await recordEvent({ type: 'ai_assistant' });
		await recordEvent({ type: 'sale_stripe', amount: 10, salesChannel: 'stripe' });
		const s = await getSummary();
		expect(s.totalProducts).toBeGreaterThanOrEqual(1);
		expect(s.totalExports).toBeGreaterThanOrEqual(1);
		expect(s.totalAiMessages).toBeGreaterThanOrEqual(2);
		expect(s.totalSalesCount).toBeGreaterThanOrEqual(1);
		expect(s.totalSalesAmount).toBeGreaterThanOrEqual(10);
	});

	it('builds time series for AI and sales', async () => {
		const ai = await getTimeSeries('ai_all');
		const sales = await getTimeSeries('sales_amount');
		expect(Array.isArray(ai)).toBe(true);
		expect(Array.isArray(sales)).toBe(true);
	});
});