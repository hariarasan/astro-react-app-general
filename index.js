/**
 * @format
 */
// Must be the first import in the app for react-native-gesture-handler
// (used by the drawer navigator) to work correctly on Android.
import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
