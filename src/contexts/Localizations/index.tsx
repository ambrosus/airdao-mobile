import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState
} from 'react';
import * as SecureStore from 'expo-secure-store';
import i18n from '../../localization/i18n';
import dayjs from 'dayjs';
import { Language, LanguageCode } from '@appTypes';
import { LocalizationUtils } from '@utils/localization';
import moment from 'moment';
import 'moment/min/locales';

interface ILanguageContext {
  changeCurrentLanguage: (language: Language) => Promise<void>;
  currentLanguage: LanguageCode;
}

const LocalizationContext = createContext<ILanguageContext>({
  changeCurrentLanguage: async () => undefined,
  currentLanguage: 'en'
});

export const LocalizationProvider: FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [currentLanguage, setLanguage] = useState<LanguageCode>('en');

  useEffect(() => {
    SecureStore.getItemAsync('Localization').then((res) => {
      if (typeof res === 'string') {
        setLanguage(LocalizationUtils.languageToCode(res as Language));
        moment.locale(LocalizationUtils.languageToCode(res as Language));
      } else {
        // TODO set default language as device default language
        SecureStore.setItemAsync('Localization', 'en');
        moment.locale('en');
        setLanguage('en');
      }
    });
  }, [currentLanguage]);

  const changeCurrentLanguage = async (newLanguage: Language) => {
    setLanguage(LocalizationUtils.languageToCode(newLanguage));
    moment.locale(LocalizationUtils.languageToCode(newLanguage));
    await SecureStore.setItemAsync('Localization', newLanguage);
  };

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
    dayjs.locale(currentLanguage);
  }, [currentLanguage]);

  return (
    <LocalizationContext.Provider
      value={{
        changeCurrentLanguage,
        currentLanguage
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export default function useLocalization() {
  return useContext(LocalizationContext);
}
