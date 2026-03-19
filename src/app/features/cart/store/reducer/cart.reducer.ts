import { createReducer, on } from '@ngrx/store';
import { CartActions } from '../cart.actions';
import { initialCartState } from '../cart.state';

export const cartReducer = createReducer(
  initialCartState,
  on(CartActions.loadCartFromStorage, (state, { cart }) => ({
    ...cart,
  })),
  on(CartActions.updateCart, (state, { cart }) => ({
    ...cart,
  })),
);
