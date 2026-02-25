/**
 * Constantes da aplicação
 * Centralize valores mágicos aqui
 */

export const APP_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],

  // Debounce times
  SEARCH_DEBOUNCE_TIME: 300,
  AUTOSAVE_DEBOUNCE_TIME: 1000,

  // Timeouts
  DEFAULT_HTTP_TIMEOUT: 30000,
  NOTIFICATION_DURATION: 3000,
  TOAST_DURATION: 5000,

  // Validation
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,

  // File upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],

  // Cache
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_CACHE_SIZE: 100,

  // Cart
  SHIPPING_THRESHOLD: 100,
  SHIPPING_COST: 10,
  TAX_RATE: 0.1,

  // Date formats
  DATE_FORMAT: 'dd/MM/yyyy',
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm',
  TIME_FORMAT: 'HH:mm',

  // Regex patterns
  PATTERNS: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/,
    URL: /^https?:\/\/.+/,
    CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  },

  // API endpoints (quando migrar para API real)
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      REGISTER: '/auth/register',
    },
    PRODUCTS: {
      BASE: '/products',
      BY_ID: (id: string) => `/products/${id}`,
      SEARCH: '/products/search',
      CATEGORIES: '/products/categories',
    },
    CART: {
      BASE: '/cart',
      ADD_ITEM: '/cart/items',
      UPDATE_ITEM: (id: string) => `/cart/items/${id}`,
      REMOVE_ITEM: (id: string) => `/cart/items/${id}`,
      CLEAR: '/cart/clear',
    },
    ORDERS: {
      BASE: '/orders',
      BY_ID: (id: string) => `/orders/${id}`,
      HISTORY: '/orders/history',
    },
  },
} as const;

/**
 * Feature flags
 * Controle de features em desenvolvimento
 */
export const FEATURE_FLAGS = {
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: false,
  ENABLE_CHAT_SUPPORT: false,
  ENABLE_WISHLIST: false,
  ENABLE_PRODUCT_REVIEWS: false,
  ENABLE_SOCIAL_LOGIN: false,
} as const;

/**
 * Storage keys
 * Centralize chaves do localStorage/sessionStorage
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  CART: 'cart',
  THEME: 'app-theme',
  LANGUAGE: 'app-language',
  RECENT_SEARCHES: 'recent_searches',
} as const;
