import React, { useCallback, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BottomSheetRef, Header } from '@components/composite';
import { Button, Spacer } from '@components/base';
import {
  AppPreferencesMenuItem,
  BottomSheetSelectBaseCurrency,
  BottomSheetSelectLanguage
} from './components';
import { Currency, Language } from '@appTypes';
import { verticalScale } from '@utils/scaling';
import { styles } from './styles';
import useLocalization from '@contexts/Localizations';
import { LocalizationUtils } from '@utils/localization';

export const AppPreferencesScreen = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLocalization();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    LocalizationUtils.languageFromCode(currentLanguage)
  );
  const [selectedCurrency, setSelectedCurrency] =
    useState<Currency>('US Dollars (USD)');
  const selectBaseCurrencyRef = useRef<BottomSheetRef>(null);
  const selectLanguageRef = useRef<BottomSheetRef>(null);

  const showCurrencySelection = useCallback(() => {
    selectBaseCurrencyRef.current?.show();
  }, []);

  const showLanguageSelection = useCallback(() => {
    selectLanguageRef.current?.show();
  }, []);

  const handleLanguageSave = useCallback((value: Language) => {
    setSelectedLanguage(value);
  }, []);

  const handleCurrencySave = useCallback((value: Currency) => {
    setSelectedCurrency(value);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={t('settings.preferences')}
        style={{ backgroundColor: 'transparent' }}
      />
      <Spacer value={verticalScale(8)} />
      <Button onPress={showCurrencySelection}>
        <AppPreferencesMenuItem
          title={t('settings.preferences.currency')}
          value={selectedCurrency}
        />
      </Button>
      <Button onPress={showLanguageSelection}>
        <AppPreferencesMenuItem
          title={t('settings.preferences.language')}
          value={t(selectedLanguage)}
        />
      </Button>
      <BottomSheetSelectBaseCurrency
        ref={selectBaseCurrencyRef}
        handleCurrencySave={handleCurrencySave}
        selectedCurrency={selectedCurrency}
      />
      <BottomSheetSelectLanguage
        ref={selectLanguageRef}
        handleLanguageSave={handleLanguageSave}
        selectedLanguage={selectedLanguage}
      />
    </SafeAreaView>
  );
};
