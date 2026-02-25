/**
 * Environment configuration for development
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  apiTimeout: 30000,
  enableMocks: true,
  enableDebugTools: true,
  logLevel: 'debug',
  features: {
    enableAnalytics: false,
    enableErrorReporting: false,
    enablePerformanceMonitoring: false,
  },
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutes
  },
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    tokenExpirationKey: 'token_expiration',
  },
};

export type Environment = typeof environment;
