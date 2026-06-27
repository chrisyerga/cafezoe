import type { ConfigContext, ExpoConfig } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'CafeZoe',
  slug: 'cafezoe',
  scheme: 'cafezoe',
  version: '0.0.1',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  ios: {
    bundleIdentifier: 'lol.cafezoe.app',
    appleTeamId: 'WPH3363N8F',
  },
  android: {
    package: 'lol.cafezoe.app',
  },
  plugins: ['expo-router', 'expo-dev-client'],
  extra: {
    convexUrl: process.env.EXPO_PUBLIC_CONVEX_URL,
  },
})
