import { TestBed } from '@angular/core/testing';
import { IProduct } from '@app/features/products/models/product.model';
import { Utils } from '@app/shared/utils/utils';
import moment from 'moment';
import { CartStore } from './cart.store';

describe('CartStore', () => {
  let store: CartStore;

  let mockProduct: IProduct = {
    id: Utils.generateId(),
    name: 'Premium Coffee Beans',
    description: 'Arabica blend from Colombia with rich flavor notes',
    price: 29.99,
    image: '/assets/images/coffee.jpg',
    category: 'Food',
    stock: 50,
    rating: 4.5,
    createdAt: moment('2026-01-01').unix(),
    updatedAt: moment('2026-01-01').unix(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [CartStore],
    }).compileComponents();

    store = TestBed.inject(CartStore);
    store.clear();
  });

  it('should add item correctly', async () => {
    const mockItemsResponse = [
      {
        product: mockProduct,
        quantity: 1,
        subtotal: 29.99,
      },
    ];

    expect(store.items().length).toBe(0);

    store.addItem(mockProduct, 1);

    expect(store.items()).toEqual(mockItemsResponse);
    expect(store.items().length).toBe(1);
  });

  it('do not duplicate item', () => {
    const mockItemsResponse = [
      {
        product: mockProduct,
        quantity: 3,
        subtotal: 89.97,
      },
    ];

    store.addItem(mockProduct, 1);
    store.addItem(mockProduct, 2);

    expect(store.items().length).toBe(1);
    expect(store.items()).toEqual(mockItemsResponse);
  });

  it('should update quantity', () => {
    store.addItem(mockProduct, 1);
    store.updateQuantity(mockProduct.id, 2);

    expect(store.items()[0].quantity).toBe(2);
  });

  it('should check if there is a shipping cost', () => {
    store.addItem(mockProduct, 1);
    expect(store.hasFreeShipping()).toBeFalsy();

    store.addItem(mockProduct, 5);
    expect(store.hasFreeShipping()).toBeTruthy();
  });

  it('should calculate total correctly', () => {
    store.addItem(mockProduct, 1);
    store.updateQuantity(mockProduct.id, 2);

    const total = mockProduct.price * store.itemCount() + store.shipping() + store.tax();

    expect(store.total()).toBe(total);
  });

  it('should remove item correctly', () => {
    store.addItem(mockProduct, 1);
    expect(store.items().length).toBe(1);

    store.removeItem(mockProduct.id);
    expect(store.items().length).toBe(0);
  });
});
