import { AfterViewInit, Directive, ElementRef, inject, Input } from '@angular/core';

/**
 * Diretiva para auto-focus em elementos
 * Uso: <input autoFocus [autoFocusDelay]="100">
 */
@Directive({
  selector: '[appAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements AfterViewInit {
  @Input() autoFocusDelay = 0;
  elementRef = inject(ElementRef);

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
    }, this.autoFocusDelay);
  }
}
