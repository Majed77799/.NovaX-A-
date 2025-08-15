import { test, expect, Page } from '@playwright/test';

type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

async function post<T extends Json>(page: Page, path: string, data: unknown): Promise<T> {
	return page.evaluate(async ({ path, data }: { path: string; data: unknown }) => {
		const res = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
		return res.json();
	}, { path, data });
}

test('open app', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('text=Effortless Conversations')).toBeVisible();
});

test('send message mock', async ({ page }) => {
	await page.goto('/');
	const data = await post<{ reply: string }>(page, '/api/chat', { text: 'hello' });
	expect(data.reply).toBe('Echo: hello');
});

test('purchase template mock', async ({ page }) => {
	await page.goto('/');
	const data = await post<{ ok: boolean; templateId: string }>(page, '/api/purchase', { templateId: 'tpl-123' });
	expect(data.ok).toBe(true);
	expect(data.templateId).toBe('tpl-123');
});