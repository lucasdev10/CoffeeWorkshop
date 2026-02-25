import { Directive, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * Diretiva para debounce em cliques
 * Uso: <button (debounceClick)="onSearch()" [debounceTime]="500">Search</button>
 */
@Directive({
  selector: '[appDebounceClick]',
  standalone: true,
})
export class DebounceClickDirective implements OnDestroy {
  @Input() debounceTime = 300;
  @Output() debounceClick = new EventEmitter();

  private clicks = new Subject<Event>();
  private subscription: Subscription;

  constructor() {
    this.subscription = this.clicks.pipe(debounceTime(this.debounceTime)).subscribe((e) => {
      this.debounceClick.emit(e);
    });
  }

  @HostListener('click', ['$event'])
  clickEvent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
