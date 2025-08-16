import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExploreFeed from '../app/(app)/explore/page';

global.IntersectionObserver = class {
	constructor(cb: any) { setTimeout(() => cb([{ isIntersecting: true }]), 0); }
	observe() {}
	unobserve() {}
	disconnect() {}
} as any;

describe('Explore feed', () => {
	it('loads initial items and paginates', async () => {
		render(<ExploreFeed />);
		expect(await screen.findByText(/Item 1/)).toBeInTheDocument();
		// Trigger pagination by intersection mock
		await act(async () => { await new Promise(r => setTimeout(r, 50)); });
		expect(await screen.findByText(/Item 9/)).toBeInTheDocument();
	});
});