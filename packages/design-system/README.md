# NovaX Design System (React Native + Expo)

- Tokens: colors, typography, spacing, radii, shadows
- Theme: light/dark with Urbanist font loading
- Components: Background, Text, Button, Card, Surface, Input, ModalSheet, Avatar, Badge

## Install

Add the workspace package to your Expo app and ensure peer deps are installed.

## Usage

```tsx
import { NovaXProvider, Background, Text, Button, Card, Input } from '@novax/design-system';

export default function App() {
	return (
		<NovaXProvider>
			<Background>
				<Card>
					<Text size="lg">Hello NovaX</Text>
					<Button onPress={() => {}}>Tap me</Button>
				</Card>
			</Background>
		</NovaXProvider>
	);
}
```