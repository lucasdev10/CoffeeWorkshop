import { ICartItem } from '../models/cart.model';

export interface ICartState {
  items: ICartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

export const initialCartState: ICartState = {
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  itemCount: 0,
};
