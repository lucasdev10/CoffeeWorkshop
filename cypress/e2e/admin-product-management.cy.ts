/// <reference types="cypress" />

describe('Admin Product Management', () => {
  beforeEach(() => {
    // Login como admin
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

  it('should create a new product and verify it appears in the list', () => {
    cy.visit('/admin/products');
    cy.contains('h1', 'Manage Products').should('be.visible');

    cy.get('body').then(($body) => {
      const hasEmptyState = $body.find('.empty-state').length > 0;
      const hasTable = $body.find('.products-table').length > 0;

      if (hasEmptyState) {
        cy.log('📋 Empty state - no products');
        createProduct();
        cy.get('.products-table tbody tr').should('have.length', 1);
      } else if (hasTable) {
        cy.get('.products-table tbody tr').then(($rows) => {
          const initialCount = $rows.length;
          cy.log(`📋 Initial count: ${initialCount}`);
          createProduct();
          cy.get('.products-table tbody tr').should('have.length', initialCount + 1);
        });
      }
    });
  });

  it('should create product and verify it appears in the public product list', () => {
    cy.visit('/admin/products/create');

    const productName = `Public Test ${Date.now()}`;
    cy.get('input[placeholder*="Notebook"]').type(productName);
    cy.get('textarea[placeholder*="Describe"]').type('Product visible to all users');
    cy.get('mat-select[placeholder*="category"]').click();
    cy.get('mat-option').first().click();
    cy.get('input[type="number"][placeholder="0,00"]').type('149.99');
    cy.get('input[type="number"][placeholder="0"]').type('5');
    cy.get('input[placeholder*="https://"]').type('https://via.placeholder.com/300');
    cy.contains('button', 'Register').click();

    // Aguarda redirecionamento e produto aparecer
    cy.url().should('include', '/admin/products');
    cy.url().should('not.include', '/create');
    cy.contains(productName, { timeout: 10000 }).should('be.visible');
    // cy.pause();

    cy.visit('/products');

    // Aguarda a página carregar
    cy.contains('h1', 'Our Products', { timeout: 10000 }).should('be.visible');

    // Aguarda o loading terminar
    cy.get('body').then(($body) => {
      if ($body.find('mat-spinner').length > 0) {
        cy.get('mat-spinner', { timeout: 10000 }).should('not.exist');
      }
    });

    // Aguarda produtos carregarem
    cy.get('app-product-card', { timeout: 10000 }).should('have.length.greaterThan', 0);

    // Verifica que o produto criado aparece
    cy.contains(productName, { timeout: 10000 }).should('be.visible');
  });

  it('should edit an existing product', () => {
    cy.visit('/admin/products');
    cy.get('.products-table').should('be.visible');
    cy.get('button[mattooltip="Edit"]').first().click();

    cy.url().should('include', '/admin/products/edit');
    cy.contains('h1', 'Edit Product').should('be.visible');

    cy.get('input[placeholder*="Notebook"]').clear().type('Updated Product Name');
    cy.contains('button', 'Update').click();

    cy.url().should('include', '/admin/products');
    cy.contains('Updated Product Name').should('be.visible');
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

// Helper function
function createProduct() {
  const productName = `Test Product ${Date.now()}`;

  cy.contains('button', 'New Product').click();
  cy.url().should('include', '/admin/products/create');

  cy.get('input[placeholder*="Notebook"]').type(productName);
  cy.get('textarea[placeholder*="Describe"]').type('This is a test product description');
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
