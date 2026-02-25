import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Evento de analytics
 */
export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Serviço de Analytics
 * Integração com Google Analytics, Mixpanel, Amplitude, etc
 */
@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private enabled = false; // Controlar via environment
  router = inject(Router);

  constructor() {
    this.initializeRouteTracking();
  }

  /**
   * Inicializa tracking de rotas
   */
  private initializeRouteTracking(): void {
    if (!this.enabled) return;

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.trackPageView(event.urlAfterRedirects);
      });
  }

  /**
   * Rastreia visualização de página
   */
  trackPageView(url: string): void {
    if (!this.enabled) return;

    console.log('📊 Page View:', url);

    // Google Analytics 4
    // gtag('event', 'page_view', {
    //   page_path: url,
    //   page_title: document.title
    // });

    // Mixpanel
    // mixpanel.track('Page View', { url });
  }

  /**
   * Rastreia evento customizado
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.enabled) return;

    console.log('📊 Event:', event);

    // Google Analytics 4
    // gtag('event', event.action, {
    //   event_category: event.category,
    //   event_label: event.label,
    //   value: event.value,
    //   ...event.metadata
    // });

    // Mixpanel
    // mixpanel.track(event.action, {
    //   category: event.category,
    //   label: event.label,
    //   value: event.value,
    //   ...event.metadata
    // });
  }

  /**
   * Rastreia conversão (compra, cadastro, etc)
   */
  trackConversion(type: string, value: number, currency = 'USD'): void {
    if (!this.enabled) return;

    console.log('📊 Conversion:', { type, value, currency });

    // Google Analytics 4
    // gtag('event', 'purchase', {
    //   transaction_id: Date.now().toString(),
    //   value: value,
    //   currency: currency
    // });
  }

  /**
   * Rastreia erro
   */
  trackError(error: Error, fatal = false): void {
    if (!this.enabled) return;

    console.log('📊 Error:', { error: error.message, fatal });

    // Google Analytics 4
    // gtag('event', 'exception', {
    //   description: error.message,
    //   fatal: fatal
    // });
  }

  /**
   * Rastreia timing (performance)
   */
  trackTiming(category: string, variable: string, time: number): void {
    if (!this.enabled) return;

    console.log('📊 Timing:', { category, variable, time });

    // Google Analytics 4
    // gtag('event', 'timing_complete', {
    //   name: variable,
    //   value: time,
    //   event_category: category
    // });
  }

  /**
   * Identifica usuário
   */
  identifyUser(userId: string, traits?: Record<string, unknown>): void {
    if (!this.enabled) return;

    console.log('📊 Identify User:', { userId, traits });

    // Google Analytics 4
    // gtag('config', 'GA_MEASUREMENT_ID', {
    //   user_id: userId
    // });

    // Mixpanel
    // mixpanel.identify(userId);
    // mixpanel.people.set(traits);
  }

  /**
   * Eventos específicos de e-commerce
   */
  ecommerce = {
    viewProduct: (product: { id: string; name: string; price: number; category: string }) => {
      this.trackEvent({
        category: 'Ecommerce',
        action: 'View Product',
        label: product.name,
        value: product.price,
        metadata: product,
      });
    },

    addToCart: (product: { id: string; name: string; price: number; quantity: number }) => {
      this.trackEvent({
        category: 'Ecommerce',
        action: 'Add to Cart',
        label: product.name,
        value: product.price * product.quantity,
        metadata: product,
      });
    },

    removeFromCart: (product: { id: string; name: string }) => {
      this.trackEvent({
        category: 'Ecommerce',
        action: 'Remove from Cart',
        label: product.name,
      });
    },

    beginCheckout: (cartValue: number, itemCount: number) => {
      this.trackEvent({
        category: 'Ecommerce',
        action: 'Begin Checkout',
        value: cartValue,
        metadata: { itemCount },
      });
    },

    purchase: (orderId: string, total: number, items: unknown[]) => {
      this.trackConversion('purchase', total);
      this.trackEvent({
        category: 'Ecommerce',
        action: 'Purchase',
        label: orderId,
        value: total,
        metadata: { items },
      });
    },
  };
}
