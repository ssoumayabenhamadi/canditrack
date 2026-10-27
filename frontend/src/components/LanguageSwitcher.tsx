import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../i18n'

/**
 * Boutons FR / EN pour changer la langue de l'interface.
 */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  return (
    <div role="group" aria-label={t('language.label')} className="flex rounded-lg ring-1 ring-slate-300">
      {LANGUAGES.map((language) => {
        const active = i18n.language === language

        return (
          <button
            key={language}
            type="button"
            onClick={() => i18n.changeLanguage(language)}
            aria-pressed={active}
            className={`px-2.5 py-1 text-xs font-semibold first:rounded-l-lg last:rounded-r-lg ${
              active ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
