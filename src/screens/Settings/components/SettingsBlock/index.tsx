import React, { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { Button, Row, Text } from '@components/base';
import { RightArrowIcon } from '@components/svg/RightArrowIcon';
import { DarkNotificationIcon } from '@components/svg/icons/DarkNotification';
import { CurrencyIcon } from '@components/svg/icons/Currency';
import { LanguageIcon } from '@components/svg/icons/Language';
import { BottomSheetRef } from '@components/composite';
import {
  BottomSheetSelectBaseCurrency,
  Currency
} from '@screens/Settings/components/SettingsBlock/modals/BottomSheetBaseCurrency';
import {
  BottomSheetSelectLanguage,
  Language
} from '@screens/Settings/components/SettingsBlock/modals/BottomSheetSelectLanguage';
import { BottomSheetNotificationSettings } from '@components/templates';
import { styles } from '@screens/Settings/components/SettingsBlock/style';
export const SettingsBlock = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('English');
  const [selectedCurrency, setSelectedCurrency] =
    useState<Currency>('US Dollars (USD)');

  const notificationSettingsRef = useRef<BottomSheetRef>(null);
  const selectBaseCurrencyRef = useRef<BottomSheetRef>(null);
  const selectLanguageRef = useRef<BottomSheetRef>(null);

  const handleOnOpenNotificationSettings = useCallback(() => {
    notificationSettingsRef.current?.show();
  }, []);

  const handleOnSelectBaseCurrency = useCallback(() => {
    selectBaseCurrencyRef.current?.show();
  }, []);

  const handleOnOpenLanguageModal = useCallback(() => {
    selectLanguageRef.current?.show();
  }, []);

  const handleLanguageSave = useCallback((value: Language) => {
    setSelectedLanguage(value);
  }, []);

  const handleCurrencySave = useCallback((value: Currency) => {
    setSelectedCurrency(value);
  }, []);

  return (
    <View style={styles.container}>
      <Button onPress={handleOnSelectBaseCurrency} type="base">
        <Row
          style={styles.optionContainer}
          justifyContent="space-between"
          alignItems="center"
        >
          <Row style={styles.infoTextContainer}>
            <CurrencyIcon />
            <Text style={styles.optionInfoText}>Base currency</Text>
          </Row>
          <Row style={styles.infoTextContainer} alignItems="center">
            <Text style={styles.optionButtonText}>{selectedCurrency}</Text>
            <RightArrowIcon />
          </Row>
        </Row>
      </Button>
      <Button onPress={handleOnOpenLanguageModal} type="base">
        <Row
          style={styles.optionContainer}
          justifyContent="space-between"
          alignItems="center"
        >
          <Row style={styles.infoTextContainer}>
            <LanguageIcon />
            <Text style={styles.optionInfoText}>Language</Text>
          </Row>
          <Row style={styles.infoTextContainer} alignItems="center">
            <Text style={styles.optionButtonText}>{selectedLanguage}</Text>
            <RightArrowIcon />
          </Row>
        </Row>
      </Button>
      <Button onPress={handleOnOpenNotificationSettings} type="base">
        <Row
          style={styles.optionContainer}
          justifyContent="space-between"
          alignItems="center"
        >
          <Row style={styles.infoTextContainer}>
            <DarkNotificationIcon />
            <Text style={styles.optionInfoText}>Notification settings</Text>
          </Row>
          <Row style={styles.infoTextContainer} alignItems="center">
            <RightArrowIcon />
          </Row>
        </Row>
      </Button>
      <BottomSheetNotificationSettings ref={notificationSettingsRef} />
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
    </View>
  );
};
