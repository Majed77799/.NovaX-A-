/************************************************
 * Global polyfills and mocks for React Native
 ***********************************************/
// @ts-ignore
if (typeof global.setImmediate === 'undefined') {
	// @ts-ignore
	global.setImmediate = (fn: (...args: unknown[]) => void, ...args: unknown[]) => setTimeout(fn, 0, ...args);
}
// @ts-ignore
if (typeof global.clearImmediate === 'undefined') {
	// @ts-ignore
	global.clearImmediate = (id: ReturnType<typeof setTimeout>) => clearTimeout(id);
}

jest.mock('expo-status-bar', () => ({ StatusBar: () => null }));