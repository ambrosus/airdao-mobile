import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import English from '../localization/locales/English.json';
import Turkish from '../localization/locales/Turkish.json';

// Comment to trigger merge
i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  compatibilityJSON: 'v3',
  debug: false,
  resources: {
    en: {
      translation: English
    },
    tr: {
      translation: Turkish
    }
  }
});

export default i18n;
