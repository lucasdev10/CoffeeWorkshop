import { Injectable } from '@angular/core';

export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warning = 2,
  Error = 3,
}

/**
 * Serviço de logging centralizado
 * Em produção, pode enviar logs para serviço externo (Sentry, LogRocket, etc)
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private logLevel: LogLevel = LogLevel.Debug;
  private enableConsole = true;

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  setConsoleLogging(enabled: boolean): void {
    this.enableConsole = enabled;
  }

  debug(message: string, ...args: unknown[]): void {
    this.log(LogLevel.Debug, message, args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log(LogLevel.Info, message, args);
  }

  warning(message: string, ...args: unknown[]): void {
    this.log(LogLevel.Warning, message, args);
  }

  error(message: string, error?: Error, ...args: unknown[]): void {
    this.log(LogLevel.Error, message, [error, ...args]);

    // TODO: Enviar para serviço de monitoramento
    // this.sendToMonitoring(message, error);
  }

  private log(level: LogLevel, message: string, args: unknown[]): void {
    if (level < this.logLevel) {
      return;
    }

    if (!this.enableConsole) {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${LogLevel[level]}]`;

    switch (level) {
      case LogLevel.Debug:
        console.debug(prefix, message, ...args);
        break;
      case LogLevel.Info:
        console.info(prefix, message, ...args);
        break;
      case LogLevel.Warning:
        console.warn(prefix, message, ...args);
        break;
      case LogLevel.Error:
        console.error(prefix, message, ...args);
        break;
    }
  }

  // private sendToMonitoring(message: string, error?: Error): void {
  //   // Implementar integração com Sentry, LogRocket, etc
  // }
}
