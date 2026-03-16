import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { initialUserState } from '../../store/user.state';
import { UserFormPageComponent } from './user-form-page';

describe('UserFormPageComponent', () => {
  let component: UserFormPageComponent;
  let fixture: ComponentFixture<UserFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormPageComponent],
      providers: [
        provideRouter([]),
        provideMockStore({
          initialState: {
            user: initialUserState,
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
