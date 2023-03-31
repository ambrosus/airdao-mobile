import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { CurrencyIcon } from '@components/svg/CurrencyIcon';
import { LanguageIcon } from '@components/svg/LanguageIcon';
import { NotificationIcon } from '@components/svg/NotificationIcon';
import { RightArrowIcon } from '@components/svg/RightArrowIcon';

export const SettingsBlock = () => {
  return (
    <View style={styles.container}>
      <Row style={styles.optionContainer} justifyContent="space-between">
        <Row style={styles.infoTextContainer}>
          <CurrencyIcon />
          <Text style={styles.optionInfoText}>Base currency</Text>
        </Row>
        <Row style={styles.infoTextContainer} alignItems="center">
          <Text style={styles.optionButtonText}>US Dollars</Text>
          <RightArrowIcon />
        </Row>
      </Row>
      <Row style={styles.optionContainer} justifyContent="space-between">
        <Row style={styles.infoTextContainer}>
          <LanguageIcon />
          <Text style={styles.optionInfoText}>Language</Text>
        </Row>
        <Row style={styles.infoTextContainer} alignItems="center">
          <Text style={styles.optionButtonText}>English</Text>
          <RightArrowIcon />
        </Row>
      </Row>
      <Row style={styles.optionContainer} justifyContent="space-between">
        <Row style={styles.infoTextContainer}>
          <NotificationIcon />
          <Text style={styles.optionInfoText}>Notification settings</Text>
        </Row>
        <Row style={styles.infoTextContainer} alignItems="center">
          <RightArrowIcon />
        </Row>
      </Row>
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
  infoTextContainer: { flexDirection: 'row' }
});
