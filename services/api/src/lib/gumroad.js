import dotenv from 'dotenv';

dotenv.config();

function parseProductMap() {
	try {
		const raw = process.env.GUMROAD_PRODUCT_MAP || '{}';
		return JSON.parse(raw);
	} catch (e) {
		return {};
	}
}

export function getGumroadUrlForTemplate(templateId) {
	const map = parseProductMap();
	return map[templateId] || null;
}

export async function validateGumroadReceipt({ templateId, email, purchaseToken }) {
	// Placeholder for Gumroad receipt validation.
	// In production you'd call Gumroad API with the license or sale token.
	if (!purchaseToken || !email) return { valid: false };
	return { valid: true, receipt: { purchaseToken, templateId, email } };
}