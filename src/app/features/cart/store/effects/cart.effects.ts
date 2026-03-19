import { inject, Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class CartEffects {
  private readonly actions$ = inject(Actions);
}
