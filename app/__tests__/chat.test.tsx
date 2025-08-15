import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChatScreen from '../app/chat';

it('sends a message and receives a streamed response', async () => {
	const { getByPlaceholderText, getByText } = render(<ChatScreen />);
	const input = getByPlaceholderText('Type a message');
	fireEvent.changeText(input, 'Hi');
	fireEvent.press(getByText('Send'));
	expect(getByText('Hi')).toBeTruthy();
	await waitFor(() => expect(getByText(/response\./)).toBeTruthy(), { timeout: 8000 });
}, 10000);
//