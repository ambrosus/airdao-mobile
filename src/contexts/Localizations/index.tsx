import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState
} from 'react';
import * as SecureStore from 'expo-secure-store';
import i18n from '../../../i18n';
import dayjs from 'dayjs';
import { Language } from '@screens/Settings/components/SettingsBlock/modals/BottomSheetSelectLanguage';

interface ILanguageContext {
  changeCurrentLanguage: (language: Language) => Promise<void>;
  currentLanguage: Language;
}

const LocalizationContext = createContext<ILanguageContext>({
  changeCurrentLanguage: async () => undefined,
  currentLanguage: 'English'
});

export const LocalizationProvider: FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [currentLanguage, setLanguage] = useState<Language>('English');

  useEffect(() => {
    SecureStore.getItemAsync('Localization').then((res) => {
      if (typeof res === 'string') {
        setLanguage(res as Language);
      } else {
        // TODO set default language as device default language
        SecureStore.setItemAsync('Localization', 'English');
        setLanguage('English');
      }
    });
  }, [currentLanguage]);

  const changeCurrentLanguage = async (newLanguage: Language) => {
    setLanguage(newLanguage);
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
