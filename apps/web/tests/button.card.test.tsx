import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button, Card } from '@repo/ui';

describe('UI components', () => {
	it('renders Button variants', () => {
		const { asFragment } = render(<div>
			<Button>Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="danger">Danger</Button>
		</div>);
		expect(asFragment()).toMatchSnapshot();
	});
	it('renders Card with content', () => {
		const { asFragment, getByText } = render(<Card title="Card" subtitle="Sub">Hello</Card>);
		expect(getByText('Hello')).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});
});