import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const stripeSecret = process.env.STRIPE_SECRET || '';
export const isStripeEnabled = Boolean(stripeSecret);

export const stripe = isStripeEnabled ? new Stripe(stripeSecret, { apiVersion: '2024-06-20' }) : null;

export async function createCheckoutSession({ price_cents, currency = 'usd', success_url, cancel_url, metadata }) {
	if (!stripe) throw new Error('Stripe not configured');
	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: [
			{
				price_data: {
					currency,
					product_data: { name: metadata?.templateTitle || 'Template' },
					unit_amount: price_cents,
				},
				quantity: 1,
			},
		],
		success_url,
		cancel_url,
		metadata,
	});
	return session;
}

export function verifyStripeWebhook(rawBody, sig) {
	if (!stripe) throw new Error('Stripe not configured');
	const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
	return stripe.webhooks.constructEvent(rawBody, sig, whSecret);
}