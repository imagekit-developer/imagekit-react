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

            // wait for 4 secs
            cy.wait(4000);

            //Verify uploaded file
            cy.get('.uploaded-img-ik').should('have.attr', 'src');
            cy.get('.uploaded-img-ik').invoke('attr', 'src').should('not.equal', '');


            // wait for 4 secs
            cy.wait(4000);

            cy.get('.state-value').invoke('val').then((val) => {
                const stateValue = JSON.parse(val);
                cy.log(JSON.stringify(stateValue, null, 2));
                expect(stateValue.overrideParametersValue.fileNameOnLocalSystem).to.be.eq("sample.jpeg"); // This asserts that the file object was passed to the onOverrideParameters callback
                expect(stateValue.uploadedImageSource).contains("sample-folder/overridden-file-name"); // This asserts that onOverrideParameters changed fileName parameter before upload
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
