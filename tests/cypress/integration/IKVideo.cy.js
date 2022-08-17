describe('IKVideo Element', () => {
    const APP_HOST = Cypress.env().APP_HOST;
  
    describe('Video-Quality-Transformation', () => {
      it('should have element with 50% low quality', () => {
        cy.visit(APP_HOST);
  
        cy.get('.ikvideo-with-thumbnail').scrollIntoView();
  
        cy.wait(1000);
  
        cy.get('.ikvideo-with-thumbnail > source')
          .should('have.attr', 'src')
          .and('include', 'tr:h-200,w-200,q-50/test/test111.mp4');
      });
    });

    describe('Video-Thumbnail', () => {
      it('should have element with thumbnail image', () => {
        cy.visit(APP_HOST);
  
        cy.get('.ikvideo-with-thumbnail').scrollIntoView();
  
        cy.wait(1000);
  
        cy.get('.ikvideo-with-thumbnail > source')
          .should('have.attr', 'src')
          .and('include', 'test/test111.mp4');
        
        cy.wait(1000);

        cy.get('.video-thumbnail-img')
          .should('have.attr', 'src')
          .and('include', 'test/test111.mp4/ik-thumbnail.jpg')
      });
    });

    describe('GIF To MP4', () => {
      it('should have mp4 video, from gif file', () => {
        cy.visit(APP_HOST);
  
        cy.get('.ikvideo-gif-to-mp4').scrollIntoView();
  
        cy.get('.ikvideo-gif-to-mp4 > source')
          .should('have.attr', 'src')
          .and('include', 'test/sample.gif');
        
        cy.wait(1000);

        cy.get('.ikvideo-gif-to-mp4 > source')
          .should('have.attr', 'src')
          .and('include', 'test/sample.gif/ik-gif-video.mp4')
      });
    });
});