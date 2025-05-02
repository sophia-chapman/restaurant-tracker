import Constants from 'expo-constants';

// Get the environment variables from app.config.js or app.json
const ENV = {
  dev: {
    apiUrl: Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  },
  prod: {
    apiUrl: Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  },
};

// Get the current environment
const getEnvVars = () => {
  return ENV.dev; // For now, we'll always use dev since we're handling environments through .env files
};

export default getEnvVars(); 