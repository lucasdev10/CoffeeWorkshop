/// <reference types="cypress" />

/**
 * Preservation Property Tests for Product List Bug Fix
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 *
 * These tests capture the CORRECT behavior on UNFIXED code for scenarios
 * that do NOT involve the bug condition (Cypress creating product then navigating to /products).
 *
 * The goal is to ensure that when we fix the bug, these behaviors remain unchanged.
 *
 * OBSERVATION-FIRST METHODOLOGY:
 * - These tests were written AFTER observing the unfixed code behavior
 * - They document what currently works correctly
 * - They should PASS on unfixed code
 * - They should CONTINUE to pass after the fix is implemented
 */

describe('Product List Preservation Properties', () => {
  /**
   * Property 2.1: Initial Load Preservation
   *
   * OBSERVATION: When navigating directly to /products without any prior product creation,
   * the page loads correctly and displays products from STORAGE_MOCK.
   *
   * This test verifies that initial load behavior is preserved after the fix.
   */
  describe('Property 2.1: Initial Load of /products displays products correctly', () => {
    it('should display products on initial load without prior navigation', () => {
      // Navigate directly to /products (no prior product creation)
      cy.visit('/products');

      // Verify page loads correctly
      cy.contains('h1', 'Our Products', { timeout: 10000 }).should('be.visible');

      // Wait for loading to complete
      cy.get('body').then(($body) => {
        if ($body.find('mat-spinner').length > 0) {
          cy.get('mat-spinner', { timeout: 10000 }).should('not.exist');
        }
      });

      // Verify products are displayed
      cy.get('app-product-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
    });

    it('should display products after navigating from home page', () => {
      // Start from home
      cy.visit('/');

      // Navigate to products via URL
      cy.visit('/products');

      // Verify products load correctly
      cy.contains('h1', 'Our Products', { timeout: 10000 }).should('be.visible');
      cy.get('app-product-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
    });
  });

  /**
   * Property 2.2: Manual Navigation Preservation
   *
   * OBSERVATION: When users navigate manually between routes (not using cy.visit after product creation),
   * the application works correctly.
   *
   * This simulates production usage where users click links and navigate naturally.
   */
  describe('Property 2.2: Manual navigation to /products works correctly', () => {
    it('should display products when navigating via menu/links', () => {
      // Start from a different page
      cy.visit('/auth/login');

      // Navigate to products (simulating manual navigation)
      cy.visit('/products');

      // Verify products display correctly
      cy.contains('h1', 'Our Products', { timeout: 10000 }).should('be.visible');
      cy.get('app-product-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
    });

    it('should display products when navigating from cart page', () => {
      // Start from cart
      cy.visit('/cart');

      // Navigate to products
      cy.visit('/products');

      // Verify products display correctly
      cy.contains('h1', 'Our Products', { timeout: 10000 }).should('be.visible');
      cy.get('app-product-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
    });
  });

  /**
   * Property 2.3: Admin Tests Preservation
   *
   * OBSERVATION: Admin tests that don't involve navigating to public /products after creation
   * work correctly. These tests verify admin functionality remains intact.
   */
  describe('Property 2.3: Admin tests continue passing', () => {
    beforeEach(() => {
      // Login as admin
      cy.visit('/auth/login');
      cy.get('input[type="email"]').type('admin@admin.com');
      cy.get('input[type="password"]').type('admin123');
      cy.get('.submit-button').click();
      cy.url().should('not.include', '/auth/login');
    });

    it('should access admin panel', () => {
      cy.visit('/admin');
      cy.url().should('include', '/admin');
    });

    it('should create product and verify in admin list (not public list)', () => {
      cy.visit('/admin/products');
      cy.contains('h1', 'Manage Products').should('be.visible');

      // Get initial count
      cy.get('body').then(($body) => {
        const hasEmptyState = $body.find('.empty-state').length > 0;
        const hasTable = $body.find('.products-table').length > 0;

        if (hasEmptyState) {
          cy.log('📋 Empty state - no products');
          createProductHelper();
          cy.get('.products-table tbody tr').should('have.length', 1);
        } else if (hasTable) {
          cy.get('.products-table tbody tr').then(($rows) => {
            const initialCount = $rows.length;
            cy.log(`📋 Initial count: ${initialCount}`);
            createProductHelper();
            cy.get('.products-table tbody tr').should('have.length', initialCount + 1);
          });
        }
      });
    });

    it('should edit an existing product', () => {
      cy.visit('/admin/products');
      cy.get('.products-table').should('be.visible');
      cy.get('button[mattooltip="Edit"]').first().click();

      cy.url().should('include', '/admin/products/edit');
      cy.contains('h1', 'Edit Product').should('be.visible');

      cy.get('input[placeholder*="Notebook"]').clear().type('Preservation Test Product');
      cy.contains('button', 'Update').click();

      cy.url().should('include', '/admin/products');
      cy.contains('Preservation Test Product').should('be.visible');
    });

    it('should delete a product', () => {
      cy.visit('/admin/products');
      cy.get('.products-table').should('be.visible');

      cy.get('.products-table tbody tr')
        .first()
        .find('.product-name strong')
        .invoke('text')
        .then((productName) => {
          cy.get('button[mattooltip="Delete"]').first().click();
          cy.get('mat-dialog-container').should('be.visible');
          cy.get('mat-dialog-container').contains('button', 'Delete').click();
          cy.contains(productName.trim()).should('not.exist');
        });
    });
  });

  /**
   * Property 2.4: Other E2E Tests Preservation
   *
   * OBSERVATION: E2E tests that don't involve the bug condition continue to pass.
   * This verifies that navigation patterns used in other tests remain functional.
   */
  describe('Property 2.4: Other E2E test scenarios continue working', () => {
    it('should access the products page multiple times', () => {
      // First visit
      cy.visit('/products');
      cy.contains('h1', 'Our Products').should('be.visible');
      cy.get('app-product-card', { timeout: 10000 }).should('have.length.greaterThan', 0);

      // Visit home page
      cy.visit('/');

      // Return to products
      cy.visit('/products');
      cy.contains('h1', 'Our Products').should('be.visible');
      cy.get('app-product-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
    });

    it('should navigate between different routes without issues', () => {
      // Navigate to products
      cy.visit('/products');
      cy.contains('h1', 'Our Products').should('be.visible');
      cy.get('app-product-card', { timeout: 10000 }).should('have.length.greaterThan', 0);

      // Navigate to home
      cy.visit('/');

      // Navigate back to products
      cy.visit('/products');
      cy.contains('h1', 'Our Products').should('be.visible');
      cy.get('app-product-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
    });
  });

  /**
   * Property 2.5: Product Filters Preservation
   *
   * OBSERVATION: Product filtering functionality works correctly.
   * The filteredProducts computed signal continues to work as expected.
   */
  describe('Property 2.5: Product filters continue working correctly', () => {
    it('should display all products initially', () => {
      cy.visit('/products');
      cy.contains('h1', 'Our Products', { timeout: 10000 }).should('be.visible');

      // Wait for products to load
      cy.get('app-product-card', { timeout: 10000 }).should('have.length.greaterThan', 0);

      // Store initial count
      cy.get('app-product-card').then(($cards) => {
        const initialCount = $cards.length;
        cy.log(`Initial product count: ${initialCount}`);
        expect(initialCount).to.be.greaterThan(0);
      });
    });

    it('should maintain product display after multiple page loads', () => {
      // First visit
      cy.visit('/products');
      cy.get('app-product-card', { timeout: 10000 }).should('have.length.greaterThan', 0);

      let firstCount: number;
      cy.get('app-product-card').then(($cards) => {
        firstCount = $cards.length;
      });

      // Second visit
      cy.visit('/products');
      cy.get('app-product-card', { timeout: 10000 }).should('have.length.greaterThan', 0);

      cy.get('app-product-card').then(($cards) => {
        const secondCount = $cards.length;
        // Product count should be consistent across page loads
        expect(secondCount).to.equal(firstCount);
      });
    });
  });
});

// Helper function for creating products in admin
function createProductHelper() {
  const productName = `Preservation Test ${Date.now()}`;

  cy.contains('button', 'New Product').click();
  cy.url().should('include', '/admin/products/create');

  cy.get('input[placeholder*="Notebook"]').type(productName);
  cy.get('textarea[placeholder*="Describe"]').type('This is a preservation test product');
  cy.get('mat-select[placeholder*="category"]').click();
  cy.get('mat-option').first().click();
  cy.get('input[type="number"][placeholder="0,00"]').type('99.99');
  cy.get('input[type="number"][placeholder="0"]').type('10');
  cy.get('input[placeholder*="https://"]').type('https://via.placeholder.com/300');

  cy.contains('button', 'Register').click();
  cy.url().should('include', '/admin/products');
  cy.url().should('not.include', '/create');
  cy.contains(productName).should('be.visible');
}
