import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para truncar texto
 * Uso: {{ longText | truncate:100 }}
 * Uso com sufixo customizado: {{ longText | truncate:100:'...' }}
 */
@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50, suffix = '...'): string {
    if (!value) return '';
    if (value.length <= limit) return value;

    return value.substring(0, limit).trim() + suffix;
  }
}
