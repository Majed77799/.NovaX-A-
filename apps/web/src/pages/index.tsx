import { Button } from '@novax/ui';

export default function HomePage() {
	return (
		<main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<Button label="NovaX Web" onPress={() => console.log('click')} />
		</main>
	);
}