// Commandes personnalisées, chargées avant chaque fichier de test
Cypress.Commands.add('login', () => {
  cy.intercept('GET', '/api/me', { fixture: 'user.json' }).as('me')
  cy.then(() => window.localStorage.setItem('canditrack_token', 'fake-token'))
})
