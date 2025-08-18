import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';
import App from './src/App';

// Inline requires can reduce startup time; silence potential warnings in dev
LogBox.ignoreLogs(['Require cycle:']);

registerRootComponent(App);