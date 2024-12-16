module.exports = {
  expo: {
    name: 'AirDAO',
    slug: 'AirDao',
    version: '1.3.5',
    orientation: 'portrait',
    icon: './assets/logo.png',
    owner: 'airdao_mobile',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      backgroundColor: '#4680FF'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      appStoreUrl: 'https://apps.apple.com/us/app/airdao/id6449670095',
      icon: './assets/logo.png',
      supportsTablet: false,
      config: {
        usesNonExemptEncryption: false
      },
      bundleIdentifier: 'io.test.airdao',
      googleServicesFile: './firebase/GoogleService-Info.plist',
      infoPlist: {
        UIBackgroundModes: ['fetch', 'remote-notification'],
        NSCameraUsageDescription: 'You can scan QR code to search addresses.',
        NSMicrophoneUsageDescription:
          'Allow $(PRODUCT_NAME) to access your microphone',
        NSFaceIDUsageDescription: 'Allow $(PRODUCT_NAME) to access FaceID'
      },
      buildNumber: '1.3.14'
    },
    android: {
      versionCode: 107,
      softwareKeyboardLayoutMode: 'pan',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'io.test.airdao',
      permissions: [
        'android.permission.CAMERA',
        'android.permission.RECORD_AUDIO'
      ],
      playStoreUrl:
        'https://play.google.com/store/apps/details?id=io.test.airdao.app',
      googleServicesFile: './firebase/google-services.json'
    },
    notification: {
      icon: './assets/notification-icon.png',
      color: '#457eff',
      androidMode: 'default',
      androidCollapsedTitle: 'Updates from AirDAO'
    },
    web: {
      favicon: './assets/favicon.png'
    },
    plugins: [
      [
        'expo-local-authentication',
        {
          faceIDPermission: 'Allow AirDAO to use Face ID.'
        }
      ],
      [
        'expo-barcode-scanner',
        {
          cameraPermission: 'You can scan QR code to search addresses.'
        }
      ],
      ['@react-native-firebase/app'],
      ['@react-native-firebase/crashlytics'],
      [
        'expo-camera',
        {
          cameraPermission: 'You can scan QR code to search addresses.'
        }
      ],
      [
        '@morrowdigital/watermelondb-expo-plugin',
        {
          databases: ['airdao.db']
        }
      ],
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static'
          },
          android: {
            kotlinVersion: '1.6.10',
            enableProguardInReleaseBuilds: true,
            enableShrinkResourcesInReleaseBuilds: true,
            extraProguardRules:
              '-keep public class com.horcrux.svg.** {*;} -keep public class com.shopify.reactnative.skia.* {*;} -keep class com.swmansion.reanimated.** { *; }',
            packagingOptions: {
              pickFirst: [
                'lib/x86/libcrypto.so',
                'lib/x86_64/libcrypto.so',
                'lib/armeabi-v7a/libcrypto.so',
                'lib/arm64-v8a/libcrypto.so'
              ]
            }
          }
        }
      ],
      ['./plugins/withNotifications.js'],
      ['./plugins/withSupportsScreenAndroid.js'],
      ['./plugins/withSecureFlag.js']
    ],
    extra: {
      eas: {
        projectId: 'fe81238e-85e8-4ace-8b87-65ff01c085b7',
        EXPO_PUBLIC_REOWN_PROJECT_ID: process.env.EXPO_PUBLIC_REOWN_PROJECT_ID
      }
    },
    runtimeVersion: {
      policy: 'sdkVersion'
    },
    updates: {
      url: 'https://u.expo.dev/fe81238e-85e8-4ace-8b87-65ff01c085b7'
    }
  }
};
