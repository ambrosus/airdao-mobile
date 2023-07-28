import { withAndroidManifest } from '@expo/config-plugins';
import { AndroidManifest, ConfigPlugin } from 'expo/config-plugins';

function addAttributesToManifest(
  androidManifest: AndroidManifest
): AndroidManifest {
  const { manifest } = androidManifest;
  manifest.$['android:smallScreens'];

  const supportsScreens = {};
  supportsScreens.$ = {
    ...supportsScreens.$,
    'android:smallScreens': false,
    'android:normalScreens': false,
    'android:largeScreens': true,
    'android:xlargeScreens': true
  };
  manifest['supports-screens'] = supportsScreens;
  return androidManifest;
}

const withSupportsScreens: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (config) => {
    config.modResults = addAttributesToManifest(config.modResults);
    return config;
  });
};

export default withSupportsScreens;
