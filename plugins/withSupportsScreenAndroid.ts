import { withAndroidManifest } from '@expo/config-plugins';
import { AndroidManifest, ConfigPlugin } from 'expo/config-plugins';

function addAttributesToManifest(
  androidManifest: AndroidManifest
): AndroidManifest {
  const { manifest } = androidManifest;

  const supportsScreens = {};
  supportsScreens.$ = {
    ...supportsScreens.$,
    'android:smallScreens': true,
    'android:normalScreens': true,
    'android:largeScreens': false,
    'android:xlargeScreens': false
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
