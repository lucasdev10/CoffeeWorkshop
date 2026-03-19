import { createActionGroup, props } from '@ngrx/store';
import { ICart } from '../models/cart.model';

export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    'Load Cart From Storage': props<{ cart: ICart }>(),
    'Update Cart': props<{ cart: ICart }>(),
  },
});
