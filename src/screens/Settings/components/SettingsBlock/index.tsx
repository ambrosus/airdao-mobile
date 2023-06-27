import React, { useCallback, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { ChevronRightIcon } from '@components/svg/icons';
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
import { COLORS } from '@constants/colors';
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
    <View testID="settings-screen_settings-block">
      {Platform.OS === 'ios' ? <Spacer value={25} /> : <Spacer value={42} />}
      {Platform.OS === 'ios' ? (
        <View testID="bottom-sheet-select-base-currency">
          <Button onPress={handleOnSelectBaseCurrency} type="base">
            <Row
              style={styles.optionContainer}
              justifyContent="space-between"
              alignItems="center"
            >
              <Row style={styles.infoTextContainer} alignItems="center">
                <CurrencyIcon />
                <Text style={styles.optionInfoText}>Base currency</Text>
              </Row>
              <Row style={styles.infoTextContainer} alignItems="center">
                <Text style={styles.optionButtonText}>{selectedCurrency}</Text>
                <ChevronRightIcon color={COLORS.smokyBlack} />
              </Row>
            </Row>
          </Button>
          <Spacer value={20} />
        </View>
      ) : (
        <View testID="bottom-sheet-select-base-currency">
          <Button onPress={handleOnSelectBaseCurrency} type="base">
            <View
              style={{
                paddingBottom: 35,
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <Row alignItems="center" style={styles.infoTextContainer}>
                <CurrencyIcon />
                <Text style={styles.optionInfoText}>Base currency</Text>
              </Row>
              <Spacer value={10} />
              <Text style={styles.optionButtonText}>{selectedCurrency}</Text>
            </View>
          </Button>
        </View>
      )}
      {Platform.OS === 'ios' ? (
        <View testID="bottom-sheet-select-language">
          <Button onPress={handleOnOpenLanguageModal} type="base">
            <Row
              style={styles.optionContainer}
              justifyContent="space-between"
              alignItems="center"
            >
              <Row alignItems="center" style={styles.infoTextContainer}>
                <LanguageIcon />
                <Text style={styles.optionInfoText}>Language</Text>
              </Row>
              <Row style={styles.infoTextContainer} alignItems="center">
                <Text style={styles.optionButtonText}>{selectedLanguage}</Text>
                <ChevronRightIcon color={COLORS.smokyBlack} />
              </Row>
            </Row>
          </Button>
          <Spacer value={20} />
        </View>
      ) : (
        <View testID="bottom-sheet-select-language">
          <Button onPress={handleOnOpenLanguageModal} type="base">
            <View
              style={{
                paddingBottom: 35,
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <Row alignItems="center" style={styles.infoTextContainer}>
                <LanguageIcon />
                <Text style={styles.optionInfoText}>Language</Text>
              </Row>
              <Spacer value={10} />
              <Text style={styles.optionButtonText}>{selectedLanguage}</Text>
              <ChevronRightIcon color={COLORS.smokyBlack} />
            </Row>
          </Row>
        </Button>
        <Spacer value={20} />
      </View>
      <View testID="bottom-sheet-notification-settings">
        <Button onPress={handleOnOpenNotificationSettings} type="base">
          <Row
            style={styles.optionContainer}
            justifyContent="space-between"
            alignItems="center"
          >
            <Row alignItems="center" style={styles.infoTextContainer}>
              <DarkNotificationIcon />
              <Text style={styles.optionInfoText}>Notification settings</Text>
            </Row>
            <Row alignItems="center" style={styles.infoTextContainer}>
              <RightArrowIcon />
            </Row>
          </Row>
        </Button>
      </View>
      <Spacer value={14} />
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
