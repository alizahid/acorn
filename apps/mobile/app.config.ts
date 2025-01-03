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
    'expo-router',
    'expo-localization',
    'expo-secure-store',
    'expo-video',
    '@bacons/apple-targets',
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
        fonts: ['./assets/fonts/sans.woff2', './assets/fonts/mono.woff2'],
      },
    ],
    [
      'expo-media-library',
      {
        photosPermission: `Allow ${name} to access your photo library.`,
        savePhotosPermission: `Allow ${name} to save photos to your library.`,
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
      buildNumber: '35',
      bundleIdentifier,
      config: {
        usesNonExemptEncryption: false,
      },
      entitlements: {
        'aps-environment': 'development',
      },
      icon: {
        dark: './assets/artwork/icon-dark.png',
        light: './assets/artwork/icon-light.png',
        tinted: './assets/artwork/icon-tinted.png',
      },
      supportsTablet: true,
    },
    name,
    newArchEnabled: true,
    orientation: 'portrait',
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
