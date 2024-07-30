import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';
import trTranslations from './locales/tr.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      tr: { translation: trTranslations },
      ar: { translation: arTranslations },
    },
    lng: localStorage.getItem('userLanguage') || 'en',
    fallbackLng: localStorage.getItem('userLanguage') || 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
