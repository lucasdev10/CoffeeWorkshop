import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ICartState } from '../cart.state';

export const selectInitialCartState = createFeatureSelector<ICartState>('cart');

export const selectState = createSelector(selectInitialCartState, (state) => state);

export const selectItems = createSelector(selectInitialCartState, (state) => state.items);

export const selectSubtotal = createSelector(selectInitialCartState, (state) => state.subtotal);

export const selectShipping = createSelector(selectInitialCartState, (state) => state.shipping);

export const selectTax = createSelector(selectInitialCartState, (state) => state.tax);

export const selectTotal = createSelector(selectInitialCartState, (state) => state.total);

export const selectItemCount = createSelector(selectInitialCartState, (state) => state.itemCount);

export const selectIsEmpty = createSelector(selectItems, (items) => items.length === 0);
