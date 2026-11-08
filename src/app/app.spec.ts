import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { initialCartState } from '@app/features/cart/store';
import { provideMockStore } from '@ngrx/store/testing';
import { App } from './app';
import { LoadingService } from './core/services/loading.service';
import { initialAuthState } from './features/auth/store';

describe('App', () => {
  describe('basic rendering', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [App],
        providers: [
          provideRouter([]),
          provideMockStore({
            initialState: {
              cart: { ...initialCartState },
              auth: { ...initialAuthState },
            },
          }),
        ],
      }).compileComponents();
    });

    it('should create the app', () => {
      const fixture = TestBed.createComponent(App);
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should render main container', async () => {
      const fixture = TestBed.createComponent(App);
      fixture.detectChanges();
      await fixture.whenStable();
      expect((fixture.nativeElement as HTMLElement).querySelector('.main-container')).toBeTruthy();
    });

    it('should not show loading overlay by default', async () => {
      const fixture = TestBed.createComponent(App);
      const loadingService = TestBed.inject(LoadingService);
      loadingService.reset();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(
        (fixture.nativeElement as HTMLElement).querySelector('.mfe-loading-overlay'),
      ).toBeNull();
    });

    it('should clean up router subscription on component destroy', () => {
      const fixture = TestBed.createComponent(App);
      fixture.detectChanges();
      expect(() => fixture.destroy()).not.toThrow();
    });
  });

  describe('loading overlay visibility (LoadingService signal controls template)', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [App],
        providers: [
          provideRouter([]),
          provideMockStore({
            initialState: {
              cart: { ...initialCartState },
              auth: { ...initialAuthState },
            },
          }),
        ],
      }).compileComponents();
    });

    it('should show .mfe-loading-overlay when LoadingService.isLoading() is true', async () => {
      const fixture = TestBed.createComponent(App);
      const loadingService = TestBed.inject(LoadingService);
      loadingService.reset();
      fixture.detectChanges();

      loadingService.show();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(
        (fixture.nativeElement as HTMLElement).querySelector('.mfe-loading-overlay'),
      ).toBeTruthy();

      loadingService.hide();
    });

    it('should hide .mfe-loading-overlay when LoadingService.isLoading() is false', async () => {
      const fixture = TestBed.createComponent(App);
      const loadingService = TestBed.inject(LoadingService);
      loadingService.reset();
      fixture.detectChanges();

      loadingService.show();
      fixture.detectChanges();
      await fixture.whenStable();

      loadingService.hide();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(
        (fixture.nativeElement as HTMLElement).querySelector('.mfe-loading-overlay'),
      ).toBeNull();
    });

    it('should render mat-progress-bar inside the loading overlay', async () => {
      const fixture = TestBed.createComponent(App);
      const loadingService = TestBed.inject(LoadingService);
      loadingService.reset();
      loadingService.show();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(
        (fixture.nativeElement as HTMLElement).querySelector(
          '.mfe-loading-overlay mat-progress-bar',
        ),
      ).toBeTruthy();

      loadingService.hide();
    });

    it('should have role="status" on the loading overlay for screen readers', async () => {
      const fixture = TestBed.createComponent(App);
      const loadingService = TestBed.inject(LoadingService);
      loadingService.reset();
      loadingService.show();
      fixture.detectChanges();
      await fixture.whenStable();

      const overlay = (fixture.nativeElement as HTMLElement).querySelector('.mfe-loading-overlay');
      expect(overlay?.getAttribute('role')).toBe('status');

      loadingService.hide();
    });
  });

  describe('loading message (mfeLoadingMessage signal)', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [App],
        providers: [
          provideRouter([]),
          provideMockStore({
            initialState: {
              cart: { ...initialCartState },
              auth: { ...initialAuthState },
            },
          }),
        ],
      }).compileComponents();
    });

    it('should display .mfe-loading-message when mfeLoadingMessage signal has a value', async () => {
      const fixture = TestBed.createComponent(App);
      const loadingService = TestBed.inject(LoadingService);
      loadingService.reset();
      fixture.detectChanges();

      // Set both loading state and message
      (fixture.componentInstance as any)['mfeLoadingMessage'].set('Loading feature...');
      loadingService.show();
      fixture.detectChanges();
      await fixture.whenStable();

      const msgEl = (fixture.nativeElement as HTMLElement).querySelector('.mfe-loading-message');
      expect(msgEl).toBeTruthy();
      expect(msgEl?.textContent?.trim()).toBe('Loading feature...');

      loadingService.hide();
    });

    it('should not render .mfe-loading-message when mfeLoadingMessage is null', async () => {
      const fixture = TestBed.createComponent(App);
      const loadingService = TestBed.inject(LoadingService);
      loadingService.reset();
      // mfeLoadingMessage defaults to null
      loadingService.show();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(
        (fixture.nativeElement as HTMLElement).querySelector('.mfe-loading-message'),
      ).toBeNull();

      loadingService.hide();
    });
  });

  /**
   * Router event wiring tests.
   * We navigate programmatically with the real router (provideRouter([])) so that
   * NavigationStart / NavigationEnd events fire through the actual Angular event pipeline,
   * which the App component subscribes to in ngOnInit.
   */
  describe('router event → LoadingService wiring', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [App],
        providers: [
          provideRouter([]),
          provideMockStore({
            initialState: {
              cart: { ...initialCartState },
              auth: { ...initialAuthState },
            },
          }),
        ],
      }).compileComponents();
    });

    it('should show loading when NavigationStart fires (via real router navigate)', async () => {
      const fixture = TestBed.createComponent(App);
      const loadingService = TestBed.inject(LoadingService);
      const router = TestBed.inject(Router);
      loadingService.reset();
      fixture.detectChanges();

      // Spy on show before navigating
      const showSpy = vi.spyOn(loadingService, 'show');
      const hideSpy = vi.spyOn(loadingService, 'hide');

      await router.navigate(['/']);
      fixture.detectChanges();
      await fixture.whenStable();

      // Navigation triggered show (NavigationStart) then hide (NavigationEnd)
      expect(showSpy).toHaveBeenCalled();
      expect(hideSpy).toHaveBeenCalled();

      // After navigation completes, loading should be off
      expect(loadingService.isLoading()).toBe(false);
    });

    it('should have no stuck loading state after successful navigation', async () => {
      const fixture = TestBed.createComponent(App);
      const loadingService = TestBed.inject(LoadingService);
      const router = TestBed.inject(Router);
      loadingService.reset();
      fixture.detectChanges();

      await router.navigate(['/']);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(loadingService.isLoading()).toBe(false);
      expect(
        (fixture.nativeElement as HTMLElement).querySelector('.mfe-loading-overlay'),
      ).toBeNull();
    });
  });
});
