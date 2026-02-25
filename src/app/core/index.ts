/**
 * Barrel exports para Core
 * Facilita importações: import { authGuard, ApiService } from '@app/core';
 */

// Guards
export * from './guards/auth.guard';
export * from './guards/role.guard';
export * from './guards/unsaved-changes.guard';

// Interceptors
export * from './interceptors/auth.interceptor';
export * from './interceptors/cache.interceptor';
export * from './interceptors/error.interceptor';
export * from './interceptors/loading.interceptor';

// Handlers
export * from './handlers/global-error.handler';

// Services
export * from './data/mock-data.service';
export * from './services/analytics.service';
export * from './services/api.service';
export * from './services/loading.service';
export * from './services/logger.service';
export * from './services/notification.service';
export * from './services/performance.service';
export * from './services/seo.service';
export * from './services/theme.service';
export * from './storage/storage';

// Config
export * from './config/app.constants';

// Operators
export * from './operators/retry-strategy.operator';
