import { type ConfigContext, type ExpoConfig } from 'expo/config'
import { withBuildProperties } from 'expo-build-properties'

export default function getConfig(context: ConfigContext): ExpoConfig {
  const projectId = '8d7d5acc-3688-4cd2-b93f-52391f665348'

  const name = 'Acorn'

  const plugins: ExpoConfig['plugins'] = [
    '@bacons/apple-targets',
    'expo-router',
    'expo-localization',
    'expo-secure-store',
    'expo-sqlite',
    'expo-web-browser',
    'react-native-bottom-tabs',
    [
      'expo-video',
      {
        supportsPictureInPicture: true,
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#fbfdfc',
        dark: {
          backgroundColor: '#101211',
        },
        image: './assets/icons/splash.png',
        imageWidth: 200,
      },
    ],
    [
      'expo-font',
      {
        fonts: [
          './assets/fonts/apercu-italic.ttf',
          './assets/fonts/apercu-upright.ttf',
          './assets/fonts/basis-italic.ttf',
          './assets/fonts/basis-upright.ttf',
          './assets/fonts/fold-italic.ttf',
          './assets/fonts/fold-upright.ttf',
          './assets/fonts/mono-regular.otf',
          './assets/fonts/mono-medium.otf',
          './assets/fonts/mono-bold.otf',
        ],
      },
    ],
    [
      'expo-media-library',
      {
        photosPermission: `Allow ${name} to access your photo library.`,
        savePhotosPermission: `Allow ${name} to save photos to your library.`,
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: `Allow ${name} to access your photo library`,
      },
    ],
    [
      'expo-screen-orientation',
      {
        initialOrientation: 'PORTRAIT_UP',
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

  const icon =
    process.env.EXPO_PUBLIC_TEST_FLIGHT === 'false'
      ? './assets/icons/app-store/AppIcon.icon'
      : './assets/icons/test-flight/AppIcon.icon'

  const config: ExpoConfig = {
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
      buildNumber: '71',
      bundleIdentifier: 'blue.acorn',
      config: {
        usesNonExemptEncryption: false,
      },
      entitlements: {
        'aps-environment': 'development',
        'com.apple.developer.icloud-container-identifiers': [
          'iCloud.blue.acorn',
        ],
        'com.apple.developer.kernel.increased-memory-limit': true,
        'com.apple.developer.ubiquity-kvstore-identifier':
          '$(TeamIdentifierPrefix)$(CFBundleIdentifier)',
      },
      icon,
      supportsTablet: true,
    },
    name,
    newArchEnabled: true,
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
  }

  return withBuildProperties(config, {
    ios: {
      extraPods: [
        {
          name: 'ffmpeg-kit-ios-full-gpl',
          podspec: 'https://acorn.blue/ffmpeg-kit-ios-full-gpl.podspec',
        },
      ],
      useFrameworks: 'static',
    },
  })
}
