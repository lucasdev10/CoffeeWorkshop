import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderComponent } from './core/layout/header/header';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MatProgressBarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('CoffeeWorkshop');
  protected readonly mfeLoadingMessage = signal<string | null>(null);

  readonly loadingService = inject(LoadingService);

  private readonly router = inject(Router);
  private routerSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator at the start of any navigation
        this.loadingService.show();
        this.mfeLoadingMessage.set('Loading feature...');
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // Hide loading indicator when navigation completes (success, cancel, or error)
        this.loadingService.hide();
        this.mfeLoadingMessage.set(null);
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
}
