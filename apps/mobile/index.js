import { registerRootComponent } from 'expo';

// Minimal UUID shim for React Native Hermes if crypto.randomUUID is missing
if (typeof global.crypto === 'undefined') {
	global.crypto = {};
}
if (typeof global.crypto.randomUUID !== 'function') {
	global.crypto.randomUUID = function randomUUIDShim() {
		const hex = [];
		for (let i = 0; i < 256; i++) hex[i] = (i + 0x100).toString(16).slice(1);
		const r = new Uint8Array(16);
		for (let i = 0; i < 16; i++) r[i] = Math.floor(Math.random() * 256);
		r[6] = (r[6] & 0x0f) | 0x40; // version 4
		r[8] = (r[8] & 0x3f) | 0x80; // variant 10
		return (
			hex[r[0]] + hex[r[1]] + hex[r[2]] + hex[r[3]] + '-' +
			hex[r[4]] + hex[r[5]] + '-' +
			hex[r[6]] + hex[r[7]] + '-' +
			hex[r[8]] + hex[r[9]] + '-' +
			hex[r[10]] + hex[r[11]] + hex[r[12]] + hex[r[13]] + hex[r[14]] + hex[r[15]]
		);
	};
}

import App from './src/App';

registerRootComponent(App);