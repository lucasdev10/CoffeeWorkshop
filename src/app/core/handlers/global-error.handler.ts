import { ErrorHandler, inject, Injectable } from '@angular/core';
import { LoggerService } from '../services/logger.service';
import { NotificationService } from '../services/notification.service';

/**
 * Global Error Handler
 * Captura todos os erros não tratados da aplicação
 *
 * Registrar no app.config.ts:
 * providers: [
 *   { provide: ErrorHandler, useClass: GlobalErrorHandler }
 * ]
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logger = inject(LoggerService);
  private readonly notification = inject(NotificationService);

  handleError(error: Error | unknown): void {
    // Log do erro
    this.logger.error('Unhandled error occurred', error as Error);

    // Extrai mensagem amigável
    const message = this.getErrorMessage(error);

    // Exibe notificação para o usuário
    this.notification.error(message);

    // Em produção, enviar para serviço de monitoramento
    // this.sendToMonitoring(error);

    // Re-throw em desenvolvimento para ver no console
    if (!this.isProduction()) {
      console.error('Global Error Handler:', error);
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message || 'An unexpected error occurred';
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'An unexpected error occurred';
  }

  private isProduction(): boolean {
    // TODO: Usar environment
    return false;
  }

  // private sendToMonitoring(error: unknown): void {
  //   // Integração com Sentry, LogRocket, etc
  // }
}
