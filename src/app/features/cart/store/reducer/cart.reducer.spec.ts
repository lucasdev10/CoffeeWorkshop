import { IProduct } from '@app/features/products/models/product.model';
import { ICart, ICartItem } from '../../models/cart.model';
import { CartActions } from '../cart.actions';
import { ICartState, initialCartState } from './../cart.state';
import { cartReducer } from './cart.reducer';

describe('CartReducer', () => {
  let mockProducts: IProduct[] = [
    {
      id: 'product-id-1',
      name: 'Premium Coffee Beans',
      description: 'Arabica blend from Colombia with rich flavor notes',
      price: 30.0,
      image: '/assets/images/coffee.jpg',
      category: 'Food',
      stock: 50,
      rating: 4.5,
      createdAt: 1774015190,
      updatedAt: 1774015190,
    },
    {
      id: 'product-id-2',
      name: 'Espresso Machine Pro',
      description: 'Professional grade espresso maker with 15 bar pressure',
      price: 500.0,
      image: '/assets/images/coffee.jpg',
      category: 'Electronics',
      stock: 15,
      rating: 4.8,
      createdAt: 1774015190,
      updatedAt: 1774015190,
    },
  ];

  const mockCartItems: ICartItem[] = [
    {
      product: mockProducts[0],
      quantity: 2,
      subtotal: 60.0,
    },
    {
      product: mockProducts[1],
      quantity: 1,
      subtotal: 500.0,
    },
  ];

  const mockCartStorage: ICart = {
    items: mockCartItems,
    subtotal: 560.0,
    shipping: 0,
    tax: 10,
    total: 616.0,
    itemCount: 3,
  };

  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = { type: 'Unknown' };
      const state = cartReducer(initialCartState, action);

      expect(state).toEqual(initialCartState);
    });
  });

  describe('Load Cart From Storage', () => {
    it('should set cart state from storage', () => {
      const action = CartActions.loadCartFromStorage({ cart: mockCartStorage });
      const state = cartReducer(initialCartState, action);

      expect(state).toEqual(mockCartStorage);
    });
  });

  describe('Update Cart', () => {
    it('should update cart', () => {
      const updatedCartItem: ICartState = {
        items: [
          {
            product: mockProducts[0],
            quantity: 1,
            subtotal: 30.0,
          },
        ],
        subtotal: 30.0,
        shipping: 10,
        tax: 10,
        total: 36.3,
        itemCount: 1,
      };
      const action = CartActions.updateCart({ cart: updatedCartItem });
      const state = cartReducer(initialCartState, action);

      expect(state).toEqual(updatedCartItem);
    });
  });
});
