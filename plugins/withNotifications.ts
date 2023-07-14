import { ConfigPlugin, withAndroidManifest } from '@expo/config-plugins';
import { AndroidManifest } from 'expo/config-plugins';

const removeExpoNotificationsAttributes = (
  androidManifest: AndroidManifest
): AndroidManifest => {
  const { manifest } = androidManifest;
  if (!Array.isArray(manifest['application'])) {
    console.warn('withNotifications: No application array in manifest');
  } else {
    const application = manifest['application'].find(
      (item) => item.$['android:name'] === '.MainApplication'
    );
    if (!application) {
      console.warn('withNotifications: No .MainApplication?');
      return androidManifest;
    }

    if (!Array.isArray(application['activity'])) {
      console.warn('withNotifications: No activity array in .MainApplication');
      return androidManifest;
    }
    const metaData = application['meta-data'];
    if (!Array.isArray(metaData)) {
      console.warn('withNotifications: No metadata array in .MainApplication');
      return androidManifest;
    }
    const attributesToRemove = [
      'expo.modules.notifications.default_notification_color',
      'expo.modules.notifications.default_notification_icon'
    ];
    application['meta-data'] = metaData.filter(
      (data) => !attributesToRemove.includes(data.$['android:name'])
    );
  }
  return androidManifest;
};

const addFirebaseAttributes = (
  androidManifest: AndroidManifest
): AndroidManifest => {
  const { manifest } = androidManifest;
  if (!Array.isArray(manifest['application'])) {
    console.warn('withNotifications: No application array in manifest');
  } else {
    const application = manifest['application'].find(
      (item) => item.$['android:name'] === '.MainApplication'
    );
    if (!application) {
      console.warn('withNotifications: No .MainApplication?');
      return androidManifest;
    }

    if (!Array.isArray(application['activity'])) {
      console.warn('withNotifications: No activity array in .MainApplication');
      return androidManifest;
    }
    if (!Array.isArray(application['meta-data'])) {
      console.warn('withNotifications: No metadata array in .MainApplication');
      return androidManifest;
    }
    application['meta-data'].push({
      $: {
        'android:name':
          'com.google.firebase.messaging.default_notification_icon',
        'android:resource': '@drawable/notification_icon'
      }
    });
  }
  return androidManifest;
};

const withNotifications: ConfigPlugin = (expoConfig) => {
  return withAndroidManifest(expoConfig, (config) => {
    config.modResults = removeExpoNotificationsAttributes(config.modResults);
    config.modResults = addFirebaseAttributes(config.modResults);
    return config;
  });
};

export default withNotifications;
