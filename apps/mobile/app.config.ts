import { type ConfigContext, type ExpoConfig } from 'expo/config'
import { withBuildProperties } from 'expo-build-properties'
import font from 'expo-font/plugin'
import imagePicker from 'expo-image-picker/plugin'
import localization from 'expo-localization/plugin'
import mediaLibrary from 'expo-media-library/plugin'
import router from 'expo-router/plugin'
import screenOrientation from 'expo-screen-orientation/plugin'
import secureStore from 'expo-secure-store/plugin'
import splashScreen from 'expo-splash-screen/plugin'
import sqlite from 'expo-sqlite/plugin'
import webBrowser from 'expo-web-browser/plugin'

export default function getConfig(context: ConfigContext): ExpoConfig {
  const name = 'Acorn'
  const projectId = '8d7d5acc-3688-4cd2-b93f-52391f665348'

  const plugins: ExpoConfig['plugins'] = [
    '@bacons/apple-targets',
    'expo-iap',
    'react-native-bottom-tabs',
    router(),
    localization(),
    secureStore(),
    sqlite(),
    webBrowser(),
    splashScreen({
      backgroundColor: '#fbfdfc',
      dark: {
        backgroundColor: '#101211',
      },
      image: './assets/icons/splash.png',
      imageWidth: 200,
    }),
    font({
      fonts: [
        './assets/fonts/apercu-italic.ttf',
        './assets/fonts/apercu-upright.ttf',
        './assets/fonts/basis-italic.ttf',
        './assets/fonts/basis-upright.ttf',
        './assets/fonts/fold-italic.ttf',
        './assets/fonts/fold-upright.ttf',
        './assets/fonts/inter-italic.ttf',
        './assets/fonts/inter-upright.ttf',
        './assets/fonts/mono-regular.otf',
        './assets/fonts/mono-medium.otf',
        './assets/fonts/mono-bold.otf',
        './assets/fonts/redacted.ttf',
      ],
    }),
    mediaLibrary({
      photosPermission: `Allow ${name} to access your photo library.`,
      savePhotosPermission: `Allow ${name} to save photos to your library.`,
    }),
    imagePicker({
      photosPermission: `Allow ${name} to access your photo library`,
    }),
    screenOrientation({
      initialOrientation: 'PORTRAIT_UP',
    }),
    [
      'react-native-nano-icons',
      {
        iconSets: [
          {
            inputDir: './assets/icons/phosphor',
            outputDir: './src/assets/icons/phosphor',
          },
        ],
      },
    ],
  ]

  if (process.env.SENTRY_AUTH_TOKEN) {
    plugins.push([
      '@sentry/react-native/expo',
      {
        organization: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
      },
    ])
  }

  const config = {
    ...context.config,
    experiments: {
      reactCompiler: true,
      tsconfigPaths: true,
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId,
      },
      router: {
        origin: false,
      },
    },
    ios: {
      appleTeamId: process.env.APPLE_TEAM_ID,
      buildNumber: '89',
      bundleIdentifier: 'blue.acorn',
      config: {
        usesNonExemptEncryption: false,
      },
      deploymentTarget: '16.4',
      entitlements: {
        'aps-environment': 'development',
        'com.apple.developer.icloud-container-identifiers': [
          'iCloud.blue.acorn',
        ],
        'com.apple.developer.kernel.increased-memory-limit': true,
        'com.apple.developer.ubiquity-kvstore-identifier':
          '$(TeamIdentifierPrefix)$(CFBundleIdentifier)',
      },
      icon: './assets/icons/AppIcon.icon',
      supportsTablet: true,
    },
    name,
    plugins,
    runtimeVersion: {
      policy: 'appVersion',
    },
    scheme: 'acorn',
    slug: 'acorn',
    updates: {
      url: `https://u.expo.dev/${projectId}`,
    },
    userInterfaceStyle: 'automatic',
    version: '1.0.0',
  } satisfies ExpoConfig

  return withBuildProperties(config, {
    ios: {
      extraPods: [
        {
          name: 'ffmpeg-kit-ios-full-gpl',
          podspec: 'https://acorn.blue/ffmpeg-kit-ios-full-gpl.podspec',
        },
      ],
    },
  })
}
