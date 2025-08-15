import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../app/index';

it('renders home content', () => {
	const { getByText } = render(<HomeScreen />);
	expect(getByText('Welcome')).toBeTruthy();
});
//