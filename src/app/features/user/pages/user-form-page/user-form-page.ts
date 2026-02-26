import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-form-page',
  imports: [],
  templateUrl: './user-form-page.html',
  styleUrl: './user-form-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class UserFormPageComponent {}
