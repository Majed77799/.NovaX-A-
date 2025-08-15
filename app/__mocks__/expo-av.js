export const Audio = {
	requestPermissionsAsync: async () => ({ status: 'granted' }),
	setAudioModeAsync: async () => {},
	Recording: class {
		prepareToRecordAsync = async () => {};
		startAsync = async () => {};
		stopAndUnloadAsync = async () => {};
		getURI = () => 'mock://recording';
	},
};