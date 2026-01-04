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
          './assets/fonts/basis-upright.woff2',
          './assets/fonts/basis-italic.woff2',
          './assets/fonts/fold-upright.woff2',
          './assets/fonts/fold-italic.woff2',
          './assets/fonts/apercu-upright.woff2',
          './assets/fonts/apercu-italic.woff2',
          './assets/fonts/mono-upright.woff2',
          './assets/fonts/mono-italic.woff2',
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
      buildNumber: '67',
      bundleIdentifier: 'blue.acorn',
      config: {
        usesNonExemptEncryption: false,
      },
      entitlements: {
        'aps-environment': 'development',
        'com.apple.developer.kernel.increased-memory-limit': true,
      },
      icon: './assets/icons/AppIcon.icon',
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
