/// <reference types="cypress" />

describe('User Shopping Flow', () => {
  beforeEach(() => {
    cy.visit('/products');
  });

  it('should access the products page', () => {
    cy.url().should('include', '/products');
    cy.contains('h1', 'Our Products').should('be.visible');
  });

  it('should add product to cart and update badge', () => {
    // Aguarda os produtos carregarem
    cy.get('app-product-card').should('have.length.greaterThan', 0);

    // Verifica que o badge está oculto inicialmente
    cy.get('.shopping-cart-button .mat-badge-content').and('contain', '0');

    // Adiciona o primeiro produto ao carrinho
    cy.get('app-product-card').first().find('button').contains('Add to Cart').click();

    // Verifica que o badge apareceu com o número 1
    cy.get('.shopping-cart-button .mat-badge-content').should('be.visible').and('contain', '1');
  });

  it('should add multiple products and badge should update correctly', () => {
    cy.get('app-product-card').should('have.length.greaterThan', 0);

    // Adiciona 3 produtos
    cy.get('app-product-card').eq(0).find('button').contains('Add to Cart').click();
    cy.get('.shopping-cart-button .mat-badge-content').should('contain', '1');

    cy.get('app-product-card').eq(1).find('button').contains('Add to Cart').click();
    cy.get('.shopping-cart-button .mat-badge-content').should('contain', '2');

    cy.get('app-product-card').eq(2).find('button').contains('Add to Cart').click();
    cy.get('.shopping-cart-button .mat-badge-content').should('contain', '3');
  });

  it('should navigate to cart and verify total is correct', () => {
    cy.get('app-product-card').should('have.length.greaterThan', 0);

    // Adiciona produtos ao carrinho
    cy.get('app-product-card').first().find('button').contains('Add to Cart').click();

    // Navega para o carrinho
    cy.get('.shopping-cart-button').click();
    cy.url().should('include', '/cart');

    // Verifica que o carrinho não está vazio
    cy.contains('h1', 'Shopping Cart').should('be.visible');
    cy.get('.cart-item').should('have.length', 1);

    // Verifica que o resumo do pedido está visível
    cy.contains('Order Summary').should('be.visible');
    cy.get('.subtotal-value').should('be.visible');
    cy.get('.tax-value').should('be.visible');
    cy.get('.total-amount').scrollIntoView().should('be.visible');
  });

  it('should calculate cart total correctly with multiple items', () => {
    cy.get('app-product-card').should('have.length.greaterThan', 0);

    // Adiciona dois produtos
    cy.get('app-product-card').eq(0).find('button').contains('Add to Cart').click();
    cy.get('app-product-card').eq(1).find('button').contains('Add to Cart').click();

    // Vai para o carrinho
    cy.get('.shopping-cart-button').click();

    // Verifica que há 2 itens
    cy.get('.cart-item').should('have.length', 2);
    cy.contains('2 items').should('be.visible');

    // Verifica que os valores estão presentes e são números válidos
    cy.get('.subtotal-value')
      .should('be.visible')
      .invoke('text')
      .should('match', /\$\d+\.\d{2}/);
    cy.get('.tax-value')
      .scrollIntoView()
      .should('be.visible')
      .invoke('text')
      .should('match', /\$\d+\.\d{2}/);
    cy.get('.total-amount')
      .should('be.visible')
      .invoke('text')
      .should('match', /\$\d+\.\d{2}/);
  });

  it('should update quantity and recalculate total', () => {
    cy.get('app-product-card').should('have.length.greaterThan', 0);

    // Adiciona um produto
    cy.get('app-product-card').first().find('button').contains('Add to Cart').click();
    cy.get('.shopping-cart-button').click();

    // Pega o total inicial
    cy.get('.total-amount')
      .invoke('text')
      .then((initialTotal) => {
        // Incrementa a quantidade
        cy.get('.quantity-controls button').contains('add').click();

        // Verifica que a quantidade mudou
        cy.get('.quantity-value').should('contain', '2');

        // Verifica que o total mudou
        cy.get('.total-amount').invoke('text').should('not.equal', initialTotal);
      });
  });

  it('should remove item from cart', () => {
    cy.get('app-product-card').should('have.length.greaterThan', 0);

    // Adiciona um produto
    cy.get('app-product-card').first().find('button').contains('Add to Cart').click();
    cy.get('.shopping-cart-button').click();

    // Remove o item
    cy.get('.remove-button').click();

    // Verifica que o carrinho está vazio
    cy.contains('Your cart is empty').should('be.visible');
    cy.contains('Start Shopping').should('be.visible');
  });
});
