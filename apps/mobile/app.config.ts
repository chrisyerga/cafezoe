import type { ConfigContext, ExpoConfig } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'CafeZoe',
  slug: 'cafezoe',
  scheme: 'cafezoe',
  version: '0.0.1',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  extra: {
    convexUrl: process.env.EXPO_PUBLIC_CONVEX_URL,
  },
})
