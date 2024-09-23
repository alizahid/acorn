import { type ConfigContext, type ExpoConfig } from 'expo/config'

export default function getConfig({ config }: ConfigContext): ExpoConfig {
  const plugins: ExpoConfig['plugins'] = [
    'expo-router',
    [
      'expo-font',
      {
        fonts: ['./assets/fonts/sans.woff2', './assets/fonts/mono.woff2'],
      },
    ],
    'expo-localization',
    'expo-secure-store',
    'expo-video',
    [
      'expo-media-library',
      {
        photosPermission: 'Allow $(PRODUCT_NAME) to access your photos.',
        savePhotosPermission: 'Allow $(PRODUCT_NAME) to save photos.',
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

  const projectId = '8d7d5acc-3688-4cd2-b93f-52391f665348'

  let name = 'Acorn'
  let bundleIdentifier = 'blue.acorn'

  if (process.env.CHANNEL === 'development') {
    name = 'Devcorn'
    bundleIdentifier += '.dev'
  }

  return {
    ...config,
    android: {
      adaptiveIcon: {
        backgroundColor: '#101211',
        foregroundImage: './assets/artwork/adaptive-icon.png',
      },
      splash: {
        dark: {
          backgroundColor: '#101211',
        },
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
      buildNumber: '11',
      bundleIdentifier,
      config: {
        usesNonExemptEncryption: false,
      },
      entitlements: {
        'aps-environment': 'development',
      },
      icon: './assets/artwork/icon.png',
      splash: {
        dark: {
          backgroundColor: '#101211',
        },
      },
      supportsTablet: true,
    },
    name,
    orientation: 'portrait',
    plugins,
    runtimeVersion: {
      policy: 'appVersion',
    },
    scheme: 'acorn',
    slug: 'acorn',
    splash: {
      backgroundColor: '#fbfdfc',
      image: './assets/artwork/splash.png',
      resizeMode: 'contain',
    },
    updates: {
      url: `https://u.expo.dev/${projectId}`,
    },
    userInterfaceStyle: 'automatic',
    version: '1.0.0',
  }
}
