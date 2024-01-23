'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
exports.__esModule = true;
var config_plugins_1 = require('@expo/config-plugins');
function addAttributesToManifest(androidManifest) {
  var manifest = androidManifest.manifest;
  var supportsScreens = {};
  supportsScreens.$ = __assign(__assign({}, supportsScreens.$), {
    'android:smallScreens': true,
    'android:normalScreens': true,
    'android:largeScreens': false,
    'android:xlargeScreens': false
  });
  manifest['supports-screens'] = supportsScreens;
  return androidManifest;
}
var withSupportsScreens = function (config) {
  return (0, config_plugins_1.withAndroidManifest)(config, function (config) {
    config.modResults = addAttributesToManifest(config.modResults);
    return config;
  });
};
exports['default'] = withSupportsScreens;
