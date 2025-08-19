import { AppRegistry } from 'react-native';
import App from './App';

const appName = 'SmokeTestApp';

AppRegistry.registerComponent(appName, () => App);

setTimeout(() => {
	console.log('SMOKE: asserting NovaX ready appears');
}, 3000);

