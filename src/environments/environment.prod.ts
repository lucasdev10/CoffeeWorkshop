import { Environment } from './environment';

/**
 * Environment configuration for production
 */
export const environment: Environment = {
  production: true,
  apiUrl: 'https://api.production.com/api',
  apiTimeout: 30000,
  enableMocks: false,
  enableDebugTools: false,
  logLevel: 'error',
  features: {
    enableAnalytics: true,
    enableErrorReporting: true,
    enablePerformanceMonitoring: true,
  },
  cache: {
    enabled: true,
    ttl: 600000, // 10 minutes
  },
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    tokenExpirationKey: 'token_expiration',
  },
};
