import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';

// Initialize i18next
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Default language
    fallbackLng: 'en',
    // Debug mode in development
    debug: import.meta.env.DEV,
    // Namespace
    defaultNS: 'translation',
    // Resources (translations)
    resources: {
      en: {
        translation: enTranslation
      },
      es: {
        translation: esTranslation
      }
    },
    // Interpolation configuration
    interpolation: {
      // React already escapes values
      escapeValue: false
    },
    // Detect language from browser
    detection: {
      // Order of detection
      order: ['localStorage', 'navigator'],
      // Cache language in localStorage
      caches: ['localStorage'],
      // Local storage key
      lookupLocalStorage: 'i18nextLng'
    }
  });

export default i18n;
