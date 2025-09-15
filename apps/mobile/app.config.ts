import { type ConfigContext, type ExpoConfig } from 'expo/config'
import { withBuildProperties } from 'expo-build-properties'

export default function getConfig(context: ConfigContext): ExpoConfig {
  const projectId = '8d7d5acc-3688-4cd2-b93f-52391f665348'

  let name = 'Acorn'
  let bundleIdentifier = 'blue.acorn'

  if (process.env.CHANNEL === 'development') {
    name = 'Devcorn'
    bundleIdentifier += '.dev'
  }

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
        image: './assets/artwork/splash-icon.png',
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
        organization: String(process.env.SENTRY_ORG),
        project: String(process.env.SENTRY_PROJECT),
      },
    ])
  }

  const config: ExpoConfig = {
    ...context.config,
    android: {
      adaptiveIcon: {
        backgroundColor: '#fbfdfc',
        foregroundImage: './assets/artwork/adaptive-icon.png',
      },
    },
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
      appleTeamId: String(process.env.APPLE_TEAM_ID),
      buildNumber: '60',
      bundleIdentifier,
      config: {
        usesNonExemptEncryption: false,
      },
      entitlements: {
        'aps-environment': 'development',
        'com.apple.developer.kernel.increased-memory-limit': true,
      },
      icon: './assets/artwork/AppIcon.icon',
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
      useFrameworks: 'static',
    },
  })
}
