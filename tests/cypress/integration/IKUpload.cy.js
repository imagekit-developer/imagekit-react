describe('IKUpload Element', () => {
    const APP_HOST = Cypress.env().APP_HOST;
  
    describe('Image Upload', () => {
        it('should upload image and render same image', () => { 
            //static file
            const p = 'sample.jpeg'
     
            // launch URL
            cy.visit(APP_HOST);
     
            //upload file with attachFile
            cy.get('.file-upload-ik').attachFile(p)
     
            // wait for 2 secs
            cy.wait(2000);
     
            //Verify uploaded file
            cy.get('.uploaded-img-ik').should('have.attr', 'src')
        });

        it('should upload non-image file and try to get error element', () => { 
            //static file
            const p = 'example.json'
     
            // launch URL
            cy.visit(APP_HOST);
     
            //upload file with attachFile
            cy.get('.file-upload-error').attachFile(p)
     
            // wait for 2 secs
            cy.wait(2000);
     
            //Verify uploaded file
            cy.get('.upload-error-ik').should('contain', 'Your request contains invalid file type.')
        });
    });
})