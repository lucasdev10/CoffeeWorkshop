import { Injectable } from '@angular/core';

/**
 * Métrica de performance
 */
interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Serviço para monitoramento de performance
 * Útil para identificar gargalos e otimizar
 */
@Injectable({
  providedIn: 'root',
})
export class PerformanceService {
  private metrics = new Map<string, PerformanceMetric>();
  private readonly enabled = true; // Controlar via environment

  /**
   * Inicia medição de performance
   */
  startMeasure(name: string, metadata?: Record<string, unknown>): void {
    if (!this.enabled) return;

    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      metadata,
    });
  }

  /**
   * Finaliza medição e retorna duração
   */
  endMeasure(name: string): number | null {
    if (!this.enabled) return null;

    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric "${name}" not found`);
      return null;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    console.log(`⏱️ ${name}: ${metric.duration.toFixed(2)}ms`, metric.metadata);

    // Em produção, enviar para serviço de monitoramento
    // this.sendToMonitoring(metric);

    this.metrics.delete(name);
    return metric.duration;
  }

  /**
   * Mede tempo de execução de uma função
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.startMeasure(name);
    try {
      const result = await fn();
      this.endMeasure(name);
      return result;
    } catch (error) {
      this.endMeasure(name);
      throw error;
    }
  }

  /**
   * Mede tempo de execução de uma função síncrona
   */
  measure<T>(name: string, fn: () => T): T {
    this.startMeasure(name);
    try {
      const result = fn();
      this.endMeasure(name);
      return result;
    } catch (error) {
      this.endMeasure(name);
      throw error;
    }
  }

  /**
   * Obtém métricas do navegador
   */
  getBrowserMetrics(): PerformanceNavigationTiming | null {
    if (!performance.getEntriesByType) return null;

    const [navigation] = performance.getEntriesByType(
      'navigation',
    ) as PerformanceNavigationTiming[];

    return navigation || null;
  }

  /**
   * Obtém métricas de recursos carregados
   */
  getResourceMetrics(): PerformanceResourceTiming[] {
    if (!performance.getEntriesByType) return [];

    return performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  }

  /**
   * Limpa métricas antigas
   */
  clear(): void {
    this.metrics.clear();
    if (performance.clearMarks) {
      performance.clearMarks();
    }
    if (performance.clearMeasures) {
      performance.clearMeasures();
    }
  }

  /**
   * Log de métricas de navegação
   */
  logNavigationMetrics(): void {
    const metrics = this.getBrowserMetrics();
    if (!metrics) return;

    console.group('📊 Navigation Metrics');
    console.log('DNS Lookup:', `${metrics.domainLookupEnd - metrics.domainLookupStart}ms`);
    console.log('TCP Connection:', `${metrics.connectEnd - metrics.connectStart}ms`);
    console.log('Request Time:', `${metrics.responseStart - metrics.requestStart}ms`);
    console.log('Response Time:', `${metrics.responseEnd - metrics.responseStart}ms`);
    console.log('DOM Processing:', `${metrics.domComplete - metrics.domInteractive}ms`);
    console.log('Load Complete:', `${metrics.loadEventEnd - metrics.loadEventStart}ms`);
    console.log('Total Time:', `${metrics.loadEventEnd - metrics.fetchStart}ms`);
    console.groupEnd();
  }
}
