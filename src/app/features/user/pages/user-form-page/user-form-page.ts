import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { email, form, FormField, minLength, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ILoginCredentials } from '@app/features/auth/models/auth.model';
import { AuthFacade } from '@app/features/auth/store';
import { FormError } from '@app/shared';
import { EUserRole, ICreateUserDto } from '../../models/user.model';
import { UserFacade } from '../../store';

@Component({
  selector: 'app-user-form-page',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormField,
    FormError,
  ],
  templateUrl: './user-form-page.html',
  styleUrl: './user-form-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class UserFormPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authFacade = inject(AuthFacade);
  private readonly userFacade = inject(UserFacade);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isLoading = signal<boolean>(false);
  protected readonly userId = signal<string | null>(null);
  protected readonly isEditMode = signal<boolean>(false);
  protected readonly hidePassword = signal<boolean>(true);

  userModel = signal<ICreateUserDto>({
    fullName: '',
    email: '',
    password: '',
    role: EUserRole.USER,
  });

  userForm = form(this.userModel, (fieldPath) => {
    required(fieldPath.fullName, { message: 'Field required' });
    minLength(fieldPath.fullName, 3, { message: 'Minimum of 3 characters' });
    required(fieldPath.email, { message: 'Field required' });
    email(fieldPath.email, { message: 'Invalid email address' });
    required(fieldPath.password, { message: 'Field required' });
    minLength(fieldPath.password, 6, { message: 'Minimum of 6 characters' });
  });

  constructor() {
    this.initializeForm();
  }

  private initializeForm(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode.set(true);
      this.userId.set(id);
      this.loadUser(id);
    }
  }

  private loadUser(id: string): void {
    this.isLoading.set(true);
    this.userFacade.loadUserById(id);

    this.userFacade.userWithLoading$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ user, isLoading }) => {
        if (isLoading) {
          return;
        }

        this.isLoading.set(false);

        if (user) {
          this.userModel.set({ ...(user as ICreateUserDto) });
        }
      });
  }

  protected togglePasswordVisibility(): void {
    this.hidePassword.update((value) => !value);
  }

  protected readonly canSubmit = computed(() => this.userForm().valid() && !this.isLoading());

  protected onSubmit(): void {
    if (this.userForm().invalid()) {
      this.userForm().markAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.userForm().controlValue();

    if (this.isEditMode() && this.userId()) {
      this.userFacade.updateUser(this.userId()!, formValue);
    } else {
      const newUser: ICreateUserDto = formValue;
      this.userFacade.createUser(newUser);
    }

    if (!this.isEditMode()) {
      this.authFacade.login({ ...(formValue as ILoginCredentials) });
    }

    // Aguarda um pouco para simular salvamento
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1000);
  }

  protected onCancel(): void {
    this.router.navigate(['/auth/login']);
  }
}
