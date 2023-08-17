import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import English from '../localization/locales/English.json';
import Turkish from '../localization/locales/Turkish.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'English',
  debug: false,
  compatibilityJSON: 'v3',
  resources: {
    English: {
      translation: English
    },
    Turkish: {
      translation: Turkish
    }
  }
});

export default i18n;
