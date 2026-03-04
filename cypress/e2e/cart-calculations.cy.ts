/// <reference types="cypress" />

describe('Cart Calculations', () => {
  beforeEach(() => {
    cy.visit('/products');
  });

  it('should calculate subtotal correctly for single item', () => {
    cy.get('app-product-card').should('have.length.greaterThan', 0);

    // Pega o preço do primeiro produto
    cy.get('app-product-card')
      .first()
      .find('.product-price')
      .invoke('text')
      .then((priceText) => {
        // Adiciona ao carrinho
        cy.get('app-product-card').first().find('button').contains('Add to Cart').click();
        cy.get('.shopping-cart-button').click();

        // Verifica que o subtotal corresponde ao preço do produto
        cy.get('.cart-item .subtotal-value').invoke('text').should('equal', priceText.trim());
      });
  });

  it('should calculate tax as 10% of subtotal', () => {
    cy.get('app-product-card').should('have.length.greaterThan', 0);

    // Adiciona produto ao carrinho
    cy.get('app-product-card').first().find('button').contains('Add to Cart').click();
    cy.get('.shopping-cart-button').click();

    // Pega o subtotal e calcula o imposto esperado
    cy.get('.summary-row .subtotal-value')
      .invoke('text')
      .then((subtotalText) => {
        const subtotal = parseFloat(subtotalText.replace('$', '').replace(',', ''));
        const expectedTax = subtotal * 0.1;

        // Verifica o valor do imposto
        cy.get('.summary-row .tax-value')
          .invoke('text')
          .then((taxText) => {
            const actualTax = parseFloat(taxText.replace('$', '').replace(',', ''));
            expect(actualTax).to.be.closeTo(expectedTax, 0.01);
          });
      });
  });

  it('should calculate total correctly (subtotal + tax + shipping)', () => {
    cy.get('app-product-card').should('have.length.greaterThan', 0);

    // Adiciona produto ao carrinho
    cy.get('app-product-card').first().find('button').contains('Add to Cart').click();
    cy.get('.shopping-cart-button').click();

    // Pega todos os valores
    cy.get('.summary-row .subtotal-value')
      .invoke('text')
      .then((subtotalText) => {
        cy.get('.summary-row .tax-value')
          .invoke('text')
          .then((taxText) => {
            cy.get('.summary-row')
              .contains('Shipping')
              .parent()
              .find('.summary-amount')
              .invoke('text')
              .then((shippingText) => {
                // Calcula o total esperado
                const subtotal = parseFloat(subtotalText.replace('$', '').replace(',', ''));
                const tax = parseFloat(taxText.replace('$', '').replace(',', ''));
                const shipping = shippingText.includes('Free')
                  ? 0
                  : parseFloat(shippingText.replace('$', '').replace(',', ''));
                const expectedTotal = subtotal + tax + shipping;

                // Verifica o total
                cy.get('.total-amount')
                  .invoke('text')
                  .then((totalText) => {
                    const actualTotal = parseFloat(totalText.replace('$', '').replace(',', ''));
                    expect(actualTotal).to.be.closeTo(expectedTotal, 0.01);
                  });
              });
          });
      });
  });

  it('should show free shipping for orders over $100', () => {
    cy.get('app-product-card').should('have.length.greaterThan', 0);

    // Adiciona múltiplos produtos até passar de $100
    cy.get('app-product-card').eq(0).find('button').contains('Add to Cart').click();
    cy.get('app-product-card').eq(1).find('button').contains('Add to Cart').click();
    cy.get('app-product-card').eq(2).find('button').contains('Add to Cart').click();

    cy.get('.shopping-cart-button').click();

    // Verifica o subtotal
    cy.get('.summary-row .subtotal-value')
      .invoke('text')
      .then((subtotalText) => {
        const subtotal = parseFloat(subtotalText.replace('$', '').replace(',', ''));

        if (subtotal >= 100) {
          // Deve mostrar frete grátis
          cy.get('.summary-row')
            .contains('Shipping')
            .parent()
            .find('.shipping-badge')
            .should('contain', 'Free');
        } else {
          // Deve mostrar valor do frete
          cy.get('.summary-row')
            .contains('Shipping')
            .parent()
            .find('.shipping-value')
            .should('be.visible');
        }
      });
  });

  it('should update all calculations when quantity changes', () => {
    cy.get('app-product-card').should('have.length.greaterThan', 0);

    // Adiciona produto ao carrinho
    cy.get('app-product-card').first().find('button').contains('Add to Cart').click();
    cy.get('.shopping-cart-button').click();

    // Pega os valores iniciais
    cy.get('.subtotal-value')
      .first()
      .invoke('text')
      .then((initialSubtotal) => {
        cy.get('.tax-value')
          .invoke('text')
          .then((initialTax) => {
            cy.get('.total-amount')
              .invoke('text')
              .then((initialTotal) => {
                // Incrementa a quantidade
                cy.get('.quantity-controls button').contains('add').click();

                // Aguarda a atualização
                cy.wait(500);

                // Verifica que todos os valores mudaram
                cy.get('.subtotal-value')
                  .first()
                  .invoke('text')
                  .should('not.equal', initialSubtotal);
                cy.get('.tax-value').invoke('text').should('not.equal', initialTax);
                cy.get('.total-amount').invoke('text').should('not.equal', initialTotal);
              });
          });
      });
  });

  it('should handle multiple items with different quantities', () => {
    cy.get('app-product-card').should('have.length.greaterThan', 0);

    // Adiciona dois produtos diferentes
    cy.get('app-product-card').eq(0).find('button').contains('Add to Cart').click();
    cy.get('app-product-card').eq(1).find('button').contains('Add to Cart').click();

    cy.get('.shopping-cart-button').click();

    // Incrementa a quantidade do primeiro item
    cy.get('.cart-item').eq(0).find('.quantity-controls button').contains('add').click();
    cy.get('.cart-item').eq(0).find('.quantity-value').should('contain', '2');

    // Incrementa a quantidade do segundo item duas vezes
    cy.get('.cart-item').eq(1).find('.quantity-controls button').contains('add').click();
    cy.get('.cart-item').eq(1).find('.quantity-controls button').contains('add').click();
    cy.get('.cart-item').eq(1).find('.quantity-value').should('contain', '3');

    // Verifica que o contador de itens está correto (2 + 3 = 5)
    cy.contains('5 items').should('be.visible');

    // Verifica que os cálculos estão corretos
    cy.get('.total-amount')
      .should('be.visible')
      .invoke('text')
      .should('match', /\$\d{1,3}(,\d{3})*\.\d{2}/);
  });
});
