describe('IKImage Element', () => {
  const APP_HOST = Cypress.env().APP_HOST;

  describe('Lazyload with LQIP', () => {
    it('should have lqip src before reaching threshold', () => {
      cy.visit(APP_HOST);

      cy.get('.lazyload-lqip')
        .should('have.attr', 'src')
        .and('include', 'tr:h-200,w-200:q-20,bl-10/default-image.jpg');
    });

    it('should have actual src after reaching element', () => {
      cy.visit(APP_HOST);

      cy.get('.lazyload-lqip').scrollIntoView();

      cy.wait(1000);

      cy.get('.lazyload-lqip')
        .should('have.attr', 'src')
        .and('include', 'tr:h-200,w-200:q-20,bl-10/default-image.jpg');
    });
  });

  describe('LQIP', () => {
    // unable to test this because actual image load always finishes too quickly
    it.skip('should have lqip src before image is loaded', () => {
      cy.visit(APP_HOST);

      cy.get('.lqip')
        .should('have.attr', 'src')
        .and('include', 'tr:h-200,w-200/default-image.jpg');
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

  describe('State update check', () => {
    it('should update image src with chained transformation outside IKContext dynamically', () => {
      cy.visit(APP_HOST);

      cy.get('.img-transformation-direct').scrollIntoView();

      cy.wait(500);

      cy.get('.img-transformation-direct')
        .should('have.attr', 'src')
        .and('include', 'tr:h-300,w-300/default-image.jpg');

      cy.get('.btn-to-change-tr-direct').click();
      cy.wait(1000);

      cy.get('.img-transformation-direct')
        .should('have.attr', 'src')
        .and('include', 'tr:h-200,w-600,rt-180:ot-TEST,oy-50,ox-100,otc-10C0F0/default-image.jpg');
    });
  });

  describe('IKCore Image Test Case', () => {
    it('should update image src, after little delay in page load', () => {
      cy.visit(APP_HOST);

      cy.contains('Render Image Using IKCore Sdk').scrollIntoView();

      cy.wait(2000);

      cy.get('.image-ikcore')
        .should('have.attr', 'src')
    });
  });

});