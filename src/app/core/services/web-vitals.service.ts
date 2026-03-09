import { Injectable } from '@angular/core';

/**
 * Web Vitals metrics interface
 */
interface WebVitalsMetrics {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
  INP?: number; // Interaction to Next Paint
}

/**
 * Service for monitoring Web Vitals metrics
 * Helps track and optimize Core Web Vitals for Lighthouse performance
 */
@Injectable({
  providedIn: 'root',
})
export class WebVitalsService {
  private metrics: WebVitalsMetrics = {};

  constructor() {
    this.initializeObservers();
  }

  /**
   * Initialize Performance Observers for Web Vitals
   */
  private initializeObservers(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Observe FCP (First Contentful Paint)
    this.observePaint();

    // Observe LCP (Largest Contentful Paint)
    this.observeLCP();

    // Observe FID (First Input Delay)
    this.observeFID();

    // Observe CLS (Cumulative Layout Shift)
    this.observeCLS();

    // Get TTFB (Time to First Byte)
    this.getTTFB();
  }

  /**
   * Observe Paint metrics (FCP)
   */
  private observePaint(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.FCP = entry.startTime;
            console.log(`✅ FCP: ${entry.startTime.toFixed(2)}ms`);
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    } catch {
      console.warn('FCP observation not supported');
    }
  }

  /**
   * Observe LCP (Largest Contentful Paint)
   */
  private observeLCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          renderTime?: number;
          loadTime?: number;
        };
        this.metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
        if (this.metrics.LCP) {
          console.log(`✅ LCP: ${this.metrics.LCP.toFixed(2)}ms`);
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch {
      console.warn('LCP observation not supported');
    }
  }

  /**
   * Observe FID (First Input Delay)
   */
  private observeFID(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEntry & {
            processingStart: number;
          };
          this.metrics.FID = fidEntry.processingStart - fidEntry.startTime;
          if (this.metrics.FID) {
            console.log(`✅ FID: ${this.metrics.FID.toFixed(2)}ms`);
          }
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    } catch {
      console.warn('FID observation not supported');
    }
  }

  /**
   * Observe CLS (Cumulative Layout Shift)
   */
  private observeCLS(): void {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as PerformanceEntry & {
            hadRecentInput: boolean;
            value: number;
          };
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value;
            this.metrics.CLS = clsValue;
            console.log(`✅ CLS: ${clsValue.toFixed(4)}`);
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch {
      console.warn('CLS observation not supported');
    }
  }

  /**
   * Get TTFB (Time to First Byte)
   */
  private getTTFB(): void {
    try {
      const navigationEntry = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        this.metrics.TTFB = navigationEntry.responseStart - navigationEntry.requestStart;
        if (this.metrics.TTFB) {
          console.log(`✅ TTFB: ${this.metrics.TTFB.toFixed(2)}ms`);
        }
      }
    } catch {
      console.warn('TTFB measurement not supported');
    }
  }

  /**
   * Get all collected metrics
   */
  getMetrics(): WebVitalsMetrics {
    return { ...this.metrics };
  }

  /**
   * Log all metrics to console
   */
  logMetrics(): void {
    console.group('📊 Web Vitals Metrics');
    console.table(this.metrics);
    console.groupEnd();

    // Check against thresholds
    this.checkThresholds();
  }

  /**
   * Check metrics against recommended thresholds
   */
  private checkThresholds(): void {
    const thresholds = {
      FCP: { good: 1800, needsImprovement: 3000 },
      LCP: { good: 2500, needsImprovement: 4000 },
      FID: { good: 100, needsImprovement: 300 },
      CLS: { good: 0.1, needsImprovement: 0.25 },
      TTFB: { good: 800, needsImprovement: 1800 },
    };

    console.group('🎯 Performance Assessment');

    Object.entries(this.metrics).forEach(([metric, value]) => {
      if (value === undefined) return;

      const threshold = thresholds[metric as keyof typeof thresholds];
      if (!threshold) return;

      let status = '🟢 Good';
      if (value > threshold.needsImprovement) {
        status = '🔴 Poor';
      } else if (value > threshold.good) {
        status = '🟡 Needs Improvement';
      }

      console.log(`${metric}: ${value.toFixed(2)} - ${status}`);
    });

    console.groupEnd();
  }
}
