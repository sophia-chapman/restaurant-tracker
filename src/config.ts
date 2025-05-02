// API configuration
const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
// Remove /api suffix if it exists to avoid double /api in URLs
export const API_BASE_URL = baseUrl.replace(/\/api$/, ''); 