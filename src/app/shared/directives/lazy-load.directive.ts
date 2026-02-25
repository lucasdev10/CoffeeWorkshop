import {
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

/**
 * Diretiva para lazy loading de imagens usando Intersection Observer
 * Uso: <img [src]="placeholder" [lazyLoad]="actualImage" (loaded)="onImageLoaded()">
 */
@Directive({
  selector: '[appLazyLoad]',
  standalone: true,
})
export class LazyLoadDirective implements OnInit, OnDestroy {
  @Output() loaded = new EventEmitter<void>();
  elementRef = inject(ElementRef<HTMLImageElement>);

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage();
          }
        });
      },
      {
        rootMargin: '50px',
      },
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private loadImage(): void {
    const img = this.elementRef.nativeElement;
    const src = img.getAttribute('data-src');

    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      this.loaded.emit();
    }

    if (this.observer) {
      this.observer.unobserve(img);
    }
  }
}
