import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Pipe para destacar texto em uma string
 * Uso: <div [innerHTML]="text | highlight:searchTerm"></div>
 */
@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  sanitizer = inject(DomSanitizer);

  transform(value: string, search: string): SafeHtml {
    if (!search || !value) {
      return value;
    }

    const regex = new RegExp(search, 'gi');
    const highlighted = value.replace(regex, (match) => `<mark class="highlight">${match}</mark>`);

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}
