module.exports = {
  expo: {
    name: 'AirDAO',
    slug: 'AirDao',
    version: '1.3.6',
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
      buildNumber: '1.3.14',
      usesAppleSignIn: true
    },
    android: {
      versionCode: 121,
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
      ['expo-apple-authentication'],
      ['@react-native-google-signin/google-signin'],
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
        REOWN_PROJECT_ID: process.env.REOWN_PROJECT_ID,
        FIREBASE_OAUTH_CLIENT_ID: process.env.FIREBASE_OAUTH_CLIENT_ID,
        W3A_CLIENT_ID: process.env.W3A_CLIENT_ID,
        W3A_GOOGLE_PROVIDER: process.env.W3A_GOOGLE_PROVIDER,
        W3A_APPLE_PROVIDER: process.env.W3A_APPLE_PROVIDER
      }
    },
    runtimeVersion: {
      policy: 'sdkVersion'
    },
    updates: {
      url: 'https://u.expo.dev/fe81238e-85e8-4ace-8b87-65ff01c085b7'
    },
    scheme: ['fb', 'airdao']
  }
};
