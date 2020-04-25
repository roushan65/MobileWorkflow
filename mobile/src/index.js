import {AppRegistry} from 'react-native';
import App from './App';

AppRegistry.registerComponent("movilizer_core_component", () => App);

AppRegistry.runApplication("movilizer_core_component", {
    rootTag: document.getElementById("root")
});