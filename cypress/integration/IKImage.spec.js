describe('ImageKit React SDK', () => {
  const APP_HOST = (Cypress && Cypress.env() && Cypress.env().APP_HOST) || 'http://localhost:3000/';

  describe('Lazyload', () => {
    it('should have empty src before reaching lazyload threshold', () => {
      cy.visit(APP_HOST);

      cy.get('.lazyload').should('have.attr', 'src').and('equal', '');
    });

    it('should have actual src after reaching lazyload threshold', () => {
      cy.visit(APP_HOST);

      cy.get('.lazyload').scrollIntoView();

      cy.wait(500);

      cy.get('.lazyload')
        .should('have.attr', 'src')
        .and('include', 'tr:h-200,w-200/default-image.jpg');
    });
  });

  describe('Lazyload with LQIP', () => {
    it('should have lqip src before reaching threshold', () => {
      cy.visit(APP_HOST);

      cy.get('.lazyload-lqip')
        .should('have.attr', 'src')
        .and('include', 'tr:h-200,w-200:q-20,bl-30/default-image.jpg');
    });

    it('should have actual src after reaching element', () => {
      cy.visit(APP_HOST);

      cy.get('.lazyload-lqip').scrollIntoView();

      cy.wait(1000);

      cy.get('.lazyload-lqip')
        .should('have.attr', 'src')
        .and('include', 'tr:h-200,w-200/default-image.jpg');
    });
  });

  describe('LQIP', () => {
    // unable to test this because actual image load always finishes too quickly
    it.skip('should have lqip src before image is loaded', () => {
      cy.visit(APP_HOST);

      cy.get('.lqip')
        .should('have.attr', 'src')
        .and('include', 'tr:h-200,w-200:q-20,bl-30/default-image.jpg');
    });

    it('should have actual src after image is loaded', () => {
      cy.visit(APP_HOST);

      cy.get('.lqip').scrollIntoView();

      cy.wait(500);

      cy.get('.lqip')
        .should('have.attr', 'src')
        .and('include', 'tr:h-200,w-200/default-image.jpg');
    });
  });
});
