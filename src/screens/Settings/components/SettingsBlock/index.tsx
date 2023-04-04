import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
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
export const SettingsBlock = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('English');
  const [selectedCurrency, setSelectedCurrency] =
    useState<Currency>('US Dollars (USD)');

  const selectBaseCurrencyRef = useRef<BottomSheetRef>(null);
  const selectLanguageRef = useRef<BottomSheetRef>(null);
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
      <Row
        style={styles.optionContainer}
        justifyContent="space-between"
        alignItems="center"
      >
        <Row style={styles.infoTextContainer}>
          <CurrencyIcon />
          <Text style={styles.optionInfoText}>Base currency</Text>
        </Row>
        <Button onPress={handleOnSelectBaseCurrency} type="base">
          <Row style={styles.infoTextContainer} alignItems="center">
            <Text style={styles.optionButtonText}>{selectedCurrency}</Text>
            <RightArrowIcon />
          </Row>
        </Button>
      </Row>
      <Row
        style={styles.optionContainer}
        justifyContent="space-between"
        alignItems="center"
      >
        <Row style={styles.infoTextContainer}>
          <LanguageIcon />
          <Text style={styles.optionInfoText}>Language</Text>
        </Row>
        <Button onPress={handleOnOpenLanguageModal} type="base">
          <Row style={styles.infoTextContainer} alignItems="center">
            <Text style={styles.optionButtonText}>{selectedLanguage}</Text>
            <RightArrowIcon />
          </Row>
        </Button>
      </Row>
      <Row
        style={styles.optionContainer}
        justifyContent="space-between"
        alignItems="center"
      >
        <Row style={styles.infoTextContainer}>
          <DarkNotificationIcon />
          <Text style={styles.optionInfoText}>Notification settings</Text>
        </Row>
        <Button style={styles.notificationsButton} type="base">
          <Row style={styles.infoTextContainer} alignItems="center">
            <RightArrowIcon />
          </Row>
        </Button>
      </Row>
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

const styles = StyleSheet.create({
  container: {
    paddingTop: 50
  },
  optionContainer: {
    paddingBottom: 35,
    flexDirection: 'row'
  },
  optionInfoText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: COLORS.black,
    paddingLeft: 12
  },
  optionButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: COLORS.lightGrey,
    paddingRight: 12
  },
  infoTextContainer: { flexDirection: 'row' },
  notificationsButton: {
    width: 45,
    alignItems: 'flex-end'
  }
});
