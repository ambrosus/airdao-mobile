'use strict';
exports.__esModule = true;
var config_plugins_1 = require('@expo/config-plugins');
var removeExpoNotificationsAttributes = function (androidManifest) {
  var manifest = androidManifest.manifest;
  if (!Array.isArray(manifest['application'])) {
    console.warn('withNotifications: No application array in manifest');
  } else {
    var application = manifest['application'].find(function (item) {
      return item.$['android:name'] === '.MainApplication';
    });
    if (!application) {
      console.warn('withNotifications: No .MainApplication?');
      return androidManifest;
    }
    if (!Array.isArray(application['activity'])) {
      console.warn('withNotifications: No activity array in .MainApplication');
      return androidManifest;
    }
    var metaData = application['meta-data'];
    if (!Array.isArray(metaData)) {
      console.warn('withNotifications: No metadata array in .MainApplication');
      return androidManifest;
    }
    var attributesToRemove_1 = [
      'expo.modules.notifications.default_notification_color',
      'expo.modules.notifications.default_notification_icon'
    ];
    application['meta-data'] = metaData.filter(function (data) {
      return !attributesToRemove_1.includes(data.$['android:name']);
    });
  }
  return androidManifest;
};
var addFirebaseAttributes = function (androidManifest) {
  var manifest = androidManifest.manifest;
  if (!Array.isArray(manifest['application'])) {
    console.warn('withNotifications: No application array in manifest');
  } else {
    var application = manifest['application'].find(function (item) {
      return item.$['android:name'] === '.MainApplication';
    });
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
var withNotifications = function (expoConfig) {
  return (0, config_plugins_1.withAndroidManifest)(
    expoConfig,
    function (config) {
      config.modResults = removeExpoNotificationsAttributes(config.modResults);
      config.modResults = addFirebaseAttributes(config.modResults);
      return config;
    }
  );
};
exports['default'] = withNotifications;
