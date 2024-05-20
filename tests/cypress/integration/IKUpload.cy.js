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
            cy.wait(4000);

            //Verify uploaded file
            cy.get('.uploaded-img-ik').should('have.attr', 'src');
            cy.get('.uploaded-img-ik').invoke('attr', 'src').should('not.equal', '');

            cy.get('.state-value').invoke('val').then((val) => {
                console.log(JSON.stringify(val, null, 2));
                expect(val).to.be.eq('uploaded');
            });
        });

        it.skip('should upload non-image file and try to get error element', () => {
            //static file
            const p = 'example.json'

            // launch URL
            cy.visit(APP_HOST);

            //upload file with attachFile
            cy.get('.file-upload-error').attachFile(p)

            // wait for 2 secs
            cy.wait(2000);

            //Verify uploaded file
            cy.get('.upload-error-ik').should('contain', 'File upload failed.')
        });
    });
});
