import { describe, it, expect, vi } from 'vitest';
import { isOwned, purchaseTemplate, type PaymentGateway } from '../../src/services/templateStore';

describe('template purchase', () => {
	it('marks template as owned after successful payment', async () => {
		const gateway: PaymentGateway = {
			charge: vi.fn<Parameters<PaymentGateway['charge']>, ReturnType<PaymentGateway['charge']>>(async () => ({ status: 'succeeded' })),
		};
		const id = 'tpl-1';
		expect(isOwned(id)).toBe(false);
		const ok = await purchaseTemplate(id, gateway);
		expect(ok).toBe(true);
		expect(isOwned(id)).toBe(true);
	});

	it('returns false on failed payment', async () => {
		const gateway: PaymentGateway = {
			charge: vi.fn<Parameters<PaymentGateway['charge']>, ReturnType<PaymentGateway['charge']>>(async () => ({ status: 'failed' })),
		};
		const id = 'tpl-2';
		expect(isOwned(id)).toBe(false);
		const ok = await purchaseTemplate(id, gateway);
		expect(ok).toBe(false);
		expect(isOwned(id)).toBe(false);
	});
});