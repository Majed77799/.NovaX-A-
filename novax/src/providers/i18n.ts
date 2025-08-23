import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to NovaX',
    },
  },
  es: {
    translation: {
      welcome: 'Bienvenido a NovaX',
    },
  },
};

const deviceLang = getLocales()[0]?.languageCode ?? 'en';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: deviceLang,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
}

export default i18n;