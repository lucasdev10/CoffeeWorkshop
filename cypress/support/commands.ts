/// <reference types="cypress" />

// Custom command para login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/auth/login');
});

// Custom command para adicionar produto ao carrinho
Cypress.Commands.add('addProductToCart', (productIndex = 0) => {
  cy.visit('/products');
  cy.get('app-product-card').should('have.length.greaterThan', 0);
  cy.get('app-product-card').eq(productIndex).find('button').contains('Add to Cart').click();
});

// Custom command para limpar o carrinho
Cypress.Commands.add('clearCart', () => {
  cy.visit('/cart');
  cy.get('body').then(($body) => {
    if ($body.find('.remove-button').length > 0) {
      cy.get('.remove-button').each(($btn) => {
        cy.wrap($btn).click();
      });
    }
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      addProductToCart(productIndex?: number): Chainable<void>;
      clearCart(): Chainable<void>;
    }
  }
}

export {};
