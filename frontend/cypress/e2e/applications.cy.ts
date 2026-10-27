describe('Candidatures', () => {
  beforeEach(() => {
    cy.login()
    cy.intercept('GET', '/api/applications*', { fixture: 'applications.json' }).as('list')
    cy.visit('/')
    cy.wait('@list')
  })

  it('affiche la liste avec les statuts et les relances', () => {
    cy.contains('3 au total').should('be.visible')
    cy.get('li').should('have.length', 3)

    cy.contains('li', 'Hays').within(() => {
      cy.contains('Envoyée').should('be.visible')
      cy.contains('À relancer').should('be.visible')
    })

    cy.contains('li', 'Externatic').within(() => {
      cy.contains('À relancer').should('not.exist')
      cy.contains('a', "Voir l'offre").should('have.attr', 'target', '_blank')
    })
  })

  it('filtre les candidatures par statut', () => {
    cy.fixture('applications.json').then((all) => {
      cy.intercept(
        { method: 'GET', pathname: '/api/applications', query: { status: 'interview' } },
        { data: [all.data[0]], meta: { current_page: 1, last_page: 1, total: 1 } },
      ).as('filtered')
    })

    cy.contains('button', 'Entretien').click()

    cy.wait('@filtered').its('request.url').should('include', 'status=interview')
    cy.get('li').should('have.length', 1)
    cy.contains('li', 'Externatic').should('be.visible')
  })

  it('crée une nouvelle candidature', () => {
    cy.intercept('POST', '/api/applications', {
      statusCode: 201,
      body: { data: { id: 4, company: '6TM', position: 'Développeuse PHP Laravel' } },
    }).as('create')

    cy.contains('button', 'Nouvelle candidature').click()
    cy.get('[role="dialog"]').within(() => {
      cy.get('#company').type('6TM')
      cy.get('#position').type('Développeuse PHP Laravel')
      cy.get('#location').type('Angers')
      cy.contains('button', 'Enregistrer').click()
    })

    cy.wait('@create').its('request.body').should('deep.include', {
      company: '6TM',
      position: 'Développeuse PHP Laravel',
      location: 'Angers',
      status: 'sent',
    })
    cy.get('[role="dialog"]').should('not.exist')
    cy.get('@list.all').should('have.length', 2) // la liste a été rechargée
  })

  it('affiche les erreurs de validation du formulaire', () => {
    cy.intercept('POST', '/api/applications', {
      statusCode: 422,
      body: {
        message: 'The given data was invalid.',
        errors: {
          company: ['Le champ entreprise est obligatoire.'],
          position: ['Le champ poste est obligatoire.'],
        },
      },
    }).as('create')

    cy.contains('button', 'Nouvelle candidature').click()
    cy.contains('button', 'Enregistrer').click()

    cy.wait('@create')
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Le champ entreprise est obligatoire.').should('be.visible')
      cy.contains('Le champ poste est obligatoire.').should('be.visible')
    })
  })

  it('change le statut depuis la liste', () => {
    cy.intercept('PATCH', '/api/applications/2', { body: { data: {} } }).as('update')

    cy.get('#status-2').select('Entretien')

    cy.wait('@update').its('request.body').should('deep.equal', { status: 'interview' })
    cy.get('@list.all').should('have.length', 2)
  })

  it('supprime une candidature après confirmation', () => {
    cy.on('window:confirm', (message) => {
      expect(message).to.contain('Acensi')
      return true
    })
    cy.intercept('DELETE', '/api/applications/3', { statusCode: 204 }).as('delete')

    cy.contains('li', 'Acensi').within(() => {
      cy.contains('button', 'Supprimer').click()
    })

    cy.wait('@delete')
    cy.get('@list.all').should('have.length', 2)
  })

  it('traduit l’interface en anglais et garde ce choix', () => {
    cy.contains('button', 'EN').click()

    cy.contains('h1', 'My applications').should('be.visible')
    cy.contains('button', 'New application').should('be.visible')
    cy.contains('li', 'Hays').within(() => {
      cy.contains('Sent').should('be.visible')
      cy.contains('Follow up').should('be.visible')
    })
    cy.get('html').should('have.attr', 'lang', 'en')

    // Après rechargement de la page, l'anglais est conservé
    cy.reload()
    cy.contains('h1', 'My applications').should('be.visible')

    cy.contains('button', 'FR').click()
    cy.contains('h1', 'Mes candidatures').should('be.visible')
  })
})
