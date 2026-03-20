import { IProduct } from '@app/features/products/models/product.model';
import { ICartItem } from '../../models/cart.model';
import { ICartState } from '../cart.state';
import {
  selectInitialCartState,
  selectIsEmpty,
  selectItemCount,
  selectItems,
  selectShipping,
  selectState,
  selectSubtotal,
  selectTax,
  selectTotal,
} from './cart.selectors';

describe('CartSelectors', () => {
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

  const createMockState = (overrides: Partial<ICartState> = {}): { cart: ICartState } => ({
    cart: {
      items: mockCartItems,
      subtotal: 560.0,
      shipping: 0,
      tax: 10,
      total: 616.0,
      itemCount: 3,
      ...overrides,
    },
  });

  describe('selectInitialCartState', () => {
    it('should select cart state selector', () => {
      const state = createMockState();
      const result = selectInitialCartState.projector(state.cart);
      expect(result).toEqual(state.cart);
    });
  });

  describe('selectState', () => {
    it('should select cart state', () => {
      const state = createMockState();
      const result = selectState.projector(state.cart);
      expect(result).toEqual(state.cart);
    });
  });

  describe('selectItems', () => {
    it('should select cart items', () => {
      const state = createMockState();
      const result = selectItems.projector(state.cart);
      expect(result).toEqual(mockCartItems);
    });
  });

  describe('selectSubtotal', () => {
    it('should select subtotal', () => {
      const state = createMockState();
      const result = selectSubtotal.projector(state.cart);
      expect(result).toBe(560.0);
    });
  });

  describe('selectShipping', () => {
    it('should select shipping', () => {
      const state = createMockState();
      const result = selectShipping.projector(state.cart);
      expect(result).toBe(0);
    });
  });

  describe('selectTax', () => {
    it('should select tax', () => {
      const state = createMockState();
      const result = selectTax.projector(state.cart);
      expect(result).toBe(10);
    });
  });

  describe('selectTotal', () => {
    it('should select total', () => {
      const state = createMockState();
      const result = selectTotal.projector(state.cart);
      expect(result).toBe(616.0);
    });
  });

  describe('selectItemCount', () => {
    it('should select item count', () => {
      const state = createMockState();
      const result = selectItemCount.projector(state.cart);
      expect(result).toBe(3);
    });
  });

  describe('selectIsEmpty', () => {
    it('should select is empty', () => {
      const state = createMockState();
      const result = selectIsEmpty.projector(mockCartItems);
      expect(result).toBeFalsy();
    });
  });
});
