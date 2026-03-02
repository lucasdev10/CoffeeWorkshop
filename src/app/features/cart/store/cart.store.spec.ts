import { TestBed } from '@angular/core/testing';
import { StorageService } from '@app/core/storage/storage';
import { IProduct } from '@app/features/products/models/product.model';
import { Utils } from '@app/shared/utils/utils';
import moment from 'moment';
import { CartStore } from './cart.store';

describe('CartStore', () => {
  let storageService: StorageService<unknown>;

  const mockProduct: IProduct = {
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartStore,
        {
          provide: StorageService,
          useValue: {
            get: vi.fn(),
            set: vi.fn(),
            remove: vi.fn(),
          },
        },
      ],
    });

    storageService = TestBed.inject(StorageService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    TestBed.resetTestingModule();
  });

  function createStore() {
    return TestBed.inject(CartStore);
  }

  it('should add item correctly', () => {
    const store = createStore();

    store.addItem(mockProduct, 1);

    expect(store.items().length).toBe(1);
    expect(store.items()[0].quantity).toBe(1);
  });

  it('should not duplicate item', () => {
    const store = createStore();

    store.addItem(mockProduct, 1);
    store.addItem(mockProduct, 2);

    expect(store.items().length).toBe(1);
    expect(store.items()[0].quantity).toBe(3);
  });

  it('should update quantity', () => {
    const store = createStore();

    store.addItem(mockProduct, 1);
    store.updateQuantity(mockProduct.id, 2);

    expect(store.items()[0].quantity).toBe(2);
  });

  it('should remove item correctly', () => {
    const store = createStore();

    store.addItem(mockProduct, 1);
    store.removeItem(mockProduct.id);

    expect(store.items().length).toBe(0);
  });

  it('should clear cart', () => {
    const store = createStore();

    store.addItem(mockProduct, 2);
    store.clear();

    expect(store.isEmpty()).toBe(true);
    expect(store.itemCount()).toBe(0);
  });

  it('should calculate totals correctly', () => {
    const store = createStore();

    store.addItem(mockProduct, 2);

    const subtotal = 59.98;
    const tax = subtotal * 0.1;
    const shipping = 10;
    const total = subtotal + tax + shipping;

    expect(store.subtotal()).toBeCloseTo(subtotal, 2);
    expect(store.tax()).toBeCloseTo(tax, 2);
    expect(store.total()).toBeCloseTo(total, 2);
  });

  it('should persist cart to localStorage', async () => {
    const store = createStore();
    const setSpy = vi.spyOn(storageService, 'set');

    store.addItem(mockProduct, 1);

    // Aguardar o effect ser executado
    await vi.waitFor(() => {
      expect(setSpy).toHaveBeenCalled();
      expect(setSpy).toHaveBeenCalledWith('cart', expect.any(Object));
    });
  });

  it('should load cart from localStorage on initialization', () => {
    const mockInitialCart = {
      items: [
        {
          product: mockProduct,
          quantity: 2,
          subtotal: 59.98,
        },
      ],
      subtotal: 59.98,
      tax: 5.998,
      shipping: 10,
      total: 75.978,
      itemCount: 2,
    };

    (storageService.get as any).mockReturnValue(mockInitialCart);

    const store = createStore();

    expect(store.items().length).toBe(1);
    expect(store.itemCount()).toBe(2);
  });
});
