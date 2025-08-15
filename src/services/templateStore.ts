export interface PaymentGateway {
	charge(params: { amountCents: number; currency: string; description: string }): Promise<{ status: 'succeeded' | 'failed' }>;
}

const ownedTemplates = new Set<string>();

export function isOwned(templateId: string): boolean {
	return ownedTemplates.has(templateId);
}

export async function purchaseTemplate(templateId: string, gateway: PaymentGateway): Promise<boolean> {
	if (ownedTemplates.has(templateId)) return true;
	const res = await gateway.charge({ amountCents: 999, currency: 'USD', description: `Template ${templateId}` });
	if (res.status === 'succeeded') {
		ownedTemplates.add(templateId);
		return true;
	}
	return false;
}