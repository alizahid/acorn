import { type ConfigContext, type ExpoConfig } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  android: {
    adaptiveIcon: {
      backgroundColor: '#fff',
      foregroundImage: './assets/images/adaptive-icon.png',
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: '8d7d5acc-3688-4cd2-b93f-52391f665348',
    },
    router: {
      origin: false,
    },
  },
  ios: {
    bundleIdentifier: 'blue.acorn',
    config: {
      usesNonExemptEncryption: false,
    },
    icon: './assets/images/icon.png',
  },
  name: 'Acorn',
  orientation: 'portrait',
  plugins: [
    'expo-router',
    'expo-font',
    'expo-localization',
    'expo-secure-store',
    'expo-video',
  ],
  runtimeVersion: {
    policy: 'appVersion',
  },
  scheme: 'acorn',
  slug: 'acorn',
  splash: {
    backgroundColor: '#fff',
    image: './assets/images/splash.png',
    resizeMode: 'contain',
  },
  updates: {
    url: 'https://u.expo.dev/edf2549b-dfeb-447c-8d58-77a5f6c52174',
  },
  userInterfaceStyle: 'automatic',
  version: '1.0.0',
})
