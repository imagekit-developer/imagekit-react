describe('IKVideo Element', () => {
    const APP_HOST = Cypress.env().APP_HOST;

    describe('Video transformation', () => {
      it('should have element with transformation', () => {
        cy.visit(APP_HOST);

        cy.get('.ikvideo-default').scrollIntoView();

        cy.wait(1000);

        cy.get('.ikvideo-default > source')
          .should('have.attr', 'src')
          .and('include', 'tr:h-200,w-200/sample-video.mp4');
      });
    });

    describe('Advance transformation', () => {
      it('should have element with advance transformation', () => {
        cy.visit(APP_HOST);

        cy.get('.ikvideo-with-tr').scrollIntoView();

        cy.wait(500);

        cy.get('.ikvideo-with-tr > source')
          .should('have.attr', 'src')
          .and('include', 'tr:h-200,w-600,b-5_red,q-95/sample-video.mp4');
      });
    });
});
