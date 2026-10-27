declare namespace Cypress {
  interface Chainable {
    /**
     * Simule un utilisateur connecté (jeton + réponse de /api/me).
     */
    login(): Chainable<void>
  }
}
