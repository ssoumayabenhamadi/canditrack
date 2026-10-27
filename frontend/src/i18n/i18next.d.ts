import 'i18next'
import type fr from './locales/fr'

// Clés de traduction typées : une faute de frappe dans t('...') provoque une erreur TypeScript
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof fr
    }
  }
}
