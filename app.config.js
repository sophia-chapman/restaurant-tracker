export default {
  expo: {
    name: 'restaurant-tracker',
    slug: 'restaurant-tracker',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    extra: {
      env: process.env.APP_ENV || 'dev',
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    },
  },
}; 