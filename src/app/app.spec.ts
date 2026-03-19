import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { initialCartState } from '@app/features/cart/store';
import { provideMockStore } from '@ngrx/store/testing';
import { App } from './app';
import { initialAuthState } from './features/auth/store';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideMockStore({
          initialState: {
            cart: {
              ...initialCartState,
            },
            auth: {
              ...initialAuthState,
            },
          },
        }),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render main container', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.main-container')).toBeTruthy();
  });
});
