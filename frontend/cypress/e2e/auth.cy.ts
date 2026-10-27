describe('Authentification', () => {
  it('redirige vers la connexion si on n’est pas connecté', () => {
    cy.visit('/')

    cy.location('pathname').should('eq', '/login')
    cy.contains('h1', 'Connexion').should('be.visible')
  })

  it('affiche une erreur avec de mauvais identifiants', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 422,
      body: {
        message: 'Identifiants incorrects.',
        errors: { email: ['Identifiants incorrects.'] },
      },
    }).as('login')

    cy.visit('/login')
    cy.get('#email').type('soumaya@example.com')
    cy.get('#password').type('mauvais-mot-de-passe')
    cy.contains('button', 'Se connecter').click()

    cy.wait('@login')
    cy.contains('Identifiants incorrects.').should('be.visible')
    cy.location('pathname').should('eq', '/login')
  })

  it('connecte l’utilisateur et affiche ses candidatures', () => {
    cy.intercept('POST', '/api/login', { fixture: 'auth.json' }).as('login')
    cy.intercept('GET', '/api/applications*', { fixture: 'applications.json' }).as('list')

    cy.visit('/login')
    cy.get('#email').type('soumaya@example.com')
    cy.get('#password').type('motdepasse123')
    cy.contains('button', 'Se connecter').click()

    cy.wait('@login').its('request.body').should('deep.equal', {
      email: 'soumaya@example.com',
      password: 'motdepasse123',
    })
    cy.wait('@list')
    cy.location('pathname').should('eq', '/')
    cy.contains('h1', 'Mes candidatures').should('be.visible')
    cy.window().its('localStorage').invoke('getItem', 'canditrack_token').should('eq', 'fake-token')
  })

  it('déconnecte l’utilisateur', () => {
    cy.login()
    cy.intercept('GET', '/api/applications*', { fixture: 'applications.json' }).as('list')
    cy.intercept('POST', '/api/logout', { body: { message: 'Déconnexion réussie.' } }).as('logout')

    cy.visit('/')
    cy.wait('@list')
    cy.contains('button', 'Déconnexion').click()

    cy.wait('@logout')
    cy.location('pathname').should('eq', '/login')
    cy.window().its('localStorage').invoke('getItem', 'canditrack_token').should('be.null')
  })
})
