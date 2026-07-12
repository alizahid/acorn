import { type ConfigContext, type ExpoConfig } from 'expo/config'
import { withBuildProperties } from 'expo-build-properties'
import expoFont from 'expo-font/plugin'
import expoImagePicker from 'expo-image-picker/plugin'
import expoLocalization from 'expo-localization/plugin'
import expoMediaLibrary from 'expo-media-library/plugin'
import expoRouter from 'expo-router/plugin'
import expoScreenOrientation from 'expo-screen-orientation/plugin'
import expoSecureStore from 'expo-secure-store/plugin'
import expoSplashScreen from 'expo-splash-screen/plugin'
import expoSqlite from 'expo-sqlite/plugin'
import expoWebBrowser from 'expo-web-browser/plugin'

export default function getConfig(context: ConfigContext): ExpoConfig {
  const name = 'Acorn'
  const projectId = '8d7d5acc-3688-4cd2-b93f-52391f665348'

  const plugins: ExpoConfig['plugins'] = [
    '@bacons/apple-targets',
    'expo-iap',
    expoRouter(),
    expoLocalization(),
    expoSecureStore(),
    expoSqlite(),
    expoWebBrowser(),
    expoSplashScreen({
      backgroundColor: '#fbfdfc',
      dark: {
        backgroundColor: '#101211',
      },
      image: './assets/icons/splash.png',
      imageWidth: 200,
    }),
    expoFont({
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
    expoMediaLibrary({
      photosPermission: `Allow ${name} to access your photo library.`,
      savePhotosPermission: `Allow ${name} to save photos to your library.`,
    }),
    expoImagePicker({
      photosPermission: `Allow ${name} to access your photo library`,
    }),
    expoScreenOrientation({
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
    [
      'react-native-video',
      {
        androidExtensions: {
          useExoplayerDash: true,
          useExoplayerHls: true,
        },
        enableAndroidPictureInPicture: true,
        enableBackgroundAudio: true,
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
      buildNumber: '80',
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
      buildReactNativeFromSource: true,
      extraPods: [
        {
          name: 'ffmpeg-kit-ios-full-gpl',
          podspec: 'https://acorn.blue/ffmpeg-kit-ios-full-gpl.podspec',
        },
      ],
      reactNativeReleaseLevel: 'canary',
      useHermesV1: true,
      usePrecompiledModules: true,
    },
  })
}
