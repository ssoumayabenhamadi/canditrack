import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import fr from './locales/fr'

export const LANGUAGES = ['fr', 'en'] as const
export type Language = (typeof LANGUAGES)[number]

const STORAGE_KEY = 'canditrack_lang'

// Langue choisie précédemment par l'utilisateur, sinon le français
const saved = localStorage.getItem(STORAGE_KEY)
const initialLanguage: Language = saved === 'en' ? 'en' : 'fr'

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: initialLanguage,
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false, // React protège déjà contre les failles XSS
  },
})

document.documentElement.lang = initialLanguage

// À chaque changement de langue : on la mémorise et on met à jour <html lang="">
i18n.on('languageChanged', (language) => {
  localStorage.setItem(STORAGE_KEY, language)
  document.documentElement.lang = language
})

export default i18n
