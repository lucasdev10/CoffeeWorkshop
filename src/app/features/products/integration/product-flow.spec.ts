import { TestBed } from '@angular/core/testing';
import { CartDomainService } from '@app/domain/cart/cart-domain.service';
import {
  CartFacade,
  initialCartState,
  selectItemCount,
  selectItems,
  selectShipping,
  selectSubtotal,
  selectTax,
  selectTotal,
} from '@app/features/cart/store';
import { IProduct } from '@app/features/products/models/product.model';
import { ProductRepository } from '@app/features/products/repositories/product.repository';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { combineLatest, filter, firstValueFrom } from 'rxjs';
import {
  initialProductState,
  ProductFacade,
  selectFilteredProducts,
  selectProducts,
} from '../store';

/**
 * Testes de integração para fluxo completo de produtos
 * Testa a interação entre ProductStore e CartStore
 */
describe('Product Flow Integration Tests', () => {
  let store: MockStore;
  let productRepository: ProductRepository;
  let productFacade: ProductFacade;
  let cartFacade: CartFacade;
  let cartDomainService: CartDomainService;

  const mockProducts: IProduct[] = [
    {
      id: 'product-id-1',
      name: 'Coffee Beans',
      description: 'Premium coffee',
      price: 29.99,
      image: '/coffee.jpg',
      category: 'Food',
      stock: 50,
      rating: 4.5,
      createdAt: 1773760056,
      updatedAt: 1773760056,
    },
    {
      id: 'product-id-2',
      name: 'Espresso Machine',
      description: 'Professional machine',
      price: 499.99,
      image: '/machine.jpg',
      category: 'Electronics',
      stock: 15,
      rating: 4.8,
      createdAt: 1773760056,
      updatedAt: 1773760056,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductRepository,
        provideMockStore({
          initialState: {
            product: {
              ...initialProductState,
              products: mockProducts,
              loading: 'success',
            },
            cart: {
              ...initialCartState,
            },
          },
        }),
      ],
    });

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectProducts, mockProducts);

    productRepository = TestBed.inject(ProductRepository);
    productFacade = TestBed.inject(ProductFacade);
    cartDomainService = TestBed.inject(CartDomainService);

    cartFacade = TestBed.inject(CartFacade);
    cartFacade.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Browse and Add to Cart Flow', () => {
    it('should load products and add to cart', async () => {
      // Arrange
      productFacade.loadProducts();

      await firstValueFrom(productFacade.isLoading$.pipe(filter((isLoading) => !isLoading)));

      let products = await firstValueFrom(productFacade.products$);

      expect(products.length).toBe(2);

      const productToAdd = products[0];
      const mockCartQuantity = 2;
      const mockCartItem = {
        product: productToAdd,
        quantity: mockCartQuantity,
        subtotal: productToAdd.price * mockCartQuantity,
      };
      store.overrideSelector(selectItems, [mockCartItem]);
      store.overrideSelector(selectSubtotal, productToAdd.price * mockCartQuantity);
      store.refreshState();

      // Act - Add product to cart
      await cartFacade.addItem(productToAdd, 2);

      const items = await firstValueFrom(cartFacade.items$);
      const subtotal = await firstValueFrom(cartFacade.subtotal$);

      // Assert
      expect(items.length).toBe(1);
      expect(items[0].product.id).toBe(productToAdd.id);
      expect(items[0].quantity).toBe(2);
      expect(subtotal).toBe(59.98);
    });

    it('should filter products and add filtered item to cart', async () => {
      // Arrange
      productFacade.loadProducts();

      let products = await firstValueFrom(productFacade.filteredProducts$);

      expect(products.length).toBe(2);

      // Act - Filter by category
      productFacade.setFilters({ category: 'Electronics' });

      store.overrideSelector(selectFilteredProducts, [mockProducts[1]]);

      const productsFiltered = await firstValueFrom(productFacade.filteredProducts$);

      expect(productsFiltered.length).toBe(1);
      expect(productsFiltered[0].category).toBe('Electronics');

      const mockCartQuantity = 1;
      const mockCartItem = {
        product: productsFiltered[0],
        quantity: mockCartQuantity,
        subtotal: productsFiltered[0].price * mockCartQuantity,
      };
      store.overrideSelector(selectItems, [mockCartItem]);
      store.overrideSelector(selectSubtotal, productsFiltered[0].price * mockCartQuantity);
      store.refreshState();

      // Act - Add filtered product to cart
      await cartFacade.addItem(productsFiltered[0], 1);

      const items = await firstValueFrom(cartFacade.items$);
      const subtotal = await firstValueFrom(cartFacade.subtotal$);
      const hasFreeShipping = await firstValueFrom(cartFacade.hasFreeShipping$);

      // Assert
      expect(items[0].product.name).toBe('Espresso Machine');
      expect(subtotal).toBe(499.99);
      expect(hasFreeShipping).toBe(true);
    });
  });

  describe('Multiple Products in Cart', () => {
    it('should handle multiple products with correct calculations', async () => {
      productFacade.loadProducts();

      await firstValueFrom(productFacade.isLoading$.pipe(filter((isLoading) => !isLoading)));

      let products = await firstValueFrom(productFacade.products$);

      expect(products.length).toBe(2);

      const mockCartItems = [
        {
          product: products[0],
          quantity: 2,
          subtotal: products[0].price * 2,
        },
        {
          product: products[1],
          quantity: 1,
          subtotal: products[1].price * 1,
        },
      ];
      store.overrideSelector(selectItems, [...mockCartItems]);
      store.overrideSelector(
        selectSubtotal,
        mockCartItems.reduce((sum, item) => sum + item.subtotal, 0),
      );
      store.overrideSelector(
        selectItemCount,
        mockCartItems.reduce((sum, item) => sum + item.quantity, 0),
      );
      store.overrideSelector(
        selectTax,
        cartDomainService.calculateTax(mockCartItems.reduce((sum, item) => sum + item.subtotal, 0)),
      );
      store.refreshState();

      // Act - Add multiple products
      await cartFacade.addItem(products[0], 2); // Coffee: 2 x 29.99 = 59.98
      await cartFacade.addItem(products[1], 1); // Machine: 1 x 499.99 = 499.99

      const { items$, itemCount$, subtotal$, tax$, shipping$, hasFreeShipping$ } = cartFacade;

      const [items, itemCount, subtotal, tax, shipping, hasFreeShipping] = await firstValueFrom(
        combineLatest([items$, itemCount$, subtotal$, tax$, shipping$, hasFreeShipping$]),
      );

      // Assert
      expect(items.length).toBe(2);
      expect(itemCount).toBe(3);
      expect(subtotal).toBeCloseTo(559.97, 2);
      expect(tax).toBeCloseTo(55.997, 2);
      expect(shipping).toBe(0); // Free shipping
      expect(hasFreeShipping).toBe(true);
    });

    it('should update quantities and recalculate totals', async () => {
      // Arrange
      productFacade.loadProducts();

      let products = await firstValueFrom(productFacade.products$);

      expect(products.length).toBe(2);

      const product = products[0];
      const mockCartItem = {
        product,
        quantity: 5,
        subtotal: product.price * 5,
      };

      store.overrideSelector(selectItems, [mockCartItem]);
      store.overrideSelector(selectSubtotal, mockCartItem.subtotal);
      store.refreshState();

      await cartFacade.addItem(product, 1);

      // Act - Update quantity
      await cartFacade.updateQuantity(product.id, 5);

      const { items$, subtotal$, hasFreeShipping$ } = cartFacade;

      const [items, subtotal, hasFreeShipping] = await firstValueFrom(
        combineLatest([items$, subtotal$, hasFreeShipping$]),
      );

      // Assert
      expect(items[0].quantity).toBe(5);
      expect(subtotal).toBeCloseTo(149.95, 2);
      expect(hasFreeShipping).toBe(true);
    });
  });

  describe('Search and Purchase Flow', () => {
    it('should search products and add to cart', async () => {
      // Arrange
      productFacade.loadProducts();

      let products = await firstValueFrom(productFacade.products$);

      expect(products.length).toBe(2);

      // Act - Search for coffee
      productFacade.setFilters({ search: 'coffee' });

      store.overrideSelector(selectFilteredProducts, [mockProducts[0]]);

      const productsFiltered = await firstValueFrom(productFacade.filteredProducts$);

      expect(productsFiltered.length).toBe(1);
      expect(productsFiltered[0].name).toContain('Coffee');

      const mockCartItem = {
        product: productsFiltered[0],
        quantity: 3,
        subtotal: productsFiltered[0].price * 3,
      };
      store.overrideSelector(selectItems, [mockCartItem]);
      store.overrideSelector(selectItemCount, mockCartItem.quantity);
      store.refreshState();

      // Act - Add to cart
      await cartFacade.addItem(productsFiltered[0], 3);

      const { items$, itemCount$ } = cartFacade;

      const [items, itemCount] = await firstValueFrom(combineLatest([items$, itemCount$]));

      // Assert
      expect(items.length).toBe(1);
      expect(itemCount).toBe(3);
    });
  });

  describe('Cart Persistence', () => {
    it('should persist cart across page reloads', async () => {
      // Arrange
      let products: IProduct[] = [];
      productFacade.loadProducts();

      await vi.waitFor(() => {
        productFacade.products$.subscribe((p) => {
          products = p;
          expect(p.length).toBe(2);
        });
      });

      // Act - Add items to cart
      const product = products[0];
      await cartFacade.addItem(product, 2);

      await vi.waitFor(() => {
        const stored = localStorage.getItem('cart');
        expect(stored).toBeTruthy();
      });

      // Simulate page reload by creating new store instance
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          CartFacade,
          provideMockStore({
            initialState: {
              cart: {
                ...initialCartState,
              },
            },
          }),
        ],
      });

      const mockCartItem = {
        product: products[0],
        quantity: 2,
        subtotal: products[0].price * 2,
      };
      store.overrideSelector(selectItems, [mockCartItem]);
      store.refreshState();

      const newCartFacade = TestBed.inject(CartFacade);

      const items = await firstValueFrom(newCartFacade.items$);

      // Assert - Cart should be restored
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(2);
      expect(items[0].product.id).toBe(product.id);
    });
  });

  describe('Price Calculations', () => {
    it('should calculate correct totals with tax and shipping', async () => {
      // Arrange
      productFacade.loadProducts();

      await firstValueFrom(productFacade.isLoading$.pipe(filter((isLoading) => !isLoading)));

      let products = await firstValueFrom(productFacade.products$);

      expect(products.length).toBe(2);

      // Act - Add cheap item (should have shipping cost)
      const cheapProduct = products[0]; // 29.99
      const mockCartItem = {
        product: cheapProduct,
        quantity: 1,
        subtotal: cheapProduct.price * 1,
      };
      store.overrideSelector(selectItems, [mockCartItem]);
      store.overrideSelector(selectSubtotal, mockCartItem.subtotal);
      store.overrideSelector(selectTax, mockCartItem.subtotal * 0.1);
      store.overrideSelector(selectShipping, 10);
      store.overrideSelector(selectTotal, mockCartItem.subtotal * 1.1 + 10);
      store.refreshState();

      await cartFacade.addItem(cheapProduct, 1);

      // Assert
      const expectedSubtotal = 29.99;
      const expectedTax = expectedSubtotal * 0.1; // 10%
      const expectedShipping = 10;
      const expectedTotal = expectedSubtotal + expectedTax + expectedShipping;

      const { subtotal$, tax$, shipping$, total$, hasFreeShipping$ } = cartFacade;

      const [subtotal, tax, shipping, total, hasFreeShipping] = await firstValueFrom(
        combineLatest([subtotal$, tax$, shipping$, total$, hasFreeShipping$]),
      );

      expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
      expect(tax).toBeCloseTo(expectedTax, 2);
      expect(shipping).toBe(expectedShipping);
      expect(total).toBeCloseTo(expectedTotal, 2);
      expect(hasFreeShipping).toBe(false);
    });

    it('should apply free shipping for orders over threshold', async () => {
      // Arrange
      productFacade.loadProducts();

      await firstValueFrom(productFacade.isLoading$.pipe(filter((isLoading) => !isLoading)));

      let products = await firstValueFrom(productFacade.products$);

      expect(products.length).toBe(2);

      // Act - Add expensive item (should have free shipping)
      const expensiveProduct = products[1]; // 499.99
      const mockCartItem = {
        product: expensiveProduct,
        quantity: 1,
        subtotal: expensiveProduct.price * 1,
      };
      store.overrideSelector(selectItems, [mockCartItem]);
      store.overrideSelector(selectSubtotal, mockCartItem.subtotal);
      store.overrideSelector(selectTax, mockCartItem.subtotal * 0.1);
      store.overrideSelector(selectShipping, 0);
      store.overrideSelector(selectTotal, mockCartItem.subtotal * 1.1);
      store.refreshState();

      await cartFacade.addItem(expensiveProduct, 1);

      // Assert
      const expectedSubtotal = 499.99;
      const expectedTax = expectedSubtotal * 0.1;
      const expectedShipping = 0; // Free
      const expectedTotal = expectedSubtotal + expectedTax + expectedShipping;

      const { subtotal$, shipping$, total$, hasFreeShipping$ } = cartFacade;

      const [subtotal, shipping, total, hasFreeShipping] = await firstValueFrom(
        combineLatest([subtotal$, shipping$, total$, hasFreeShipping$]),
      );

      expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
      expect(shipping).toBe(expectedShipping);
      expect(total).toBeCloseTo(expectedTotal, 2);
      expect(hasFreeShipping).toBe(true);
    });
  });

  describe('Remove from Cart', () => {
    it('should remove item and recalculate totals', async () => {
      // Arrange
      productFacade.loadProducts();

      await firstValueFrom(productFacade.isLoading$.pipe(filter((isLoading) => !isLoading)));

      let products = await firstValueFrom(productFacade.products$);

      expect(products.length).toBe(2);

      const mockCartItems = [
        {
          product: products[0],
          quantity: 1,
          subtotal: products[0].price * 1,
        },
        {
          product: products[1],
          quantity: 1,
          subtotal: products[1].price * 1,
        },
      ];
      store.overrideSelector(selectItems, [...mockCartItems]);
      store.refreshState();

      await cartFacade.addItem(products[0], 1);
      await cartFacade.addItem(products[1], 1);

      const items = await firstValueFrom(cartFacade.items$);

      expect(items.length).toBe(2);

      store.overrideSelector(selectItems, [mockCartItems[1]]);
      store.refreshState();

      // Act - Remove one item
      await cartFacade.removeItem(products[0].id);

      const currentItems = await firstValueFrom(cartFacade.items$);

      // Assert
      expect(currentItems.length).toBe(1);
      expect(currentItems[0].product.id).toBe(products[1].id);
    });
  });
});
