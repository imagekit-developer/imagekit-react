import { defineConfig } from 'cypress'

export default defineConfig({
  fixturesFolder: 'fixtures',
  screenshotsFolder: 'screenshots',
  videosFolder: 'videos',
  env: {
    APP_HOST: 'http://localhost:3000/',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./plugins/index.js')(on, config)
    },
    specPattern: 'integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'support/index.js',
  },
})
