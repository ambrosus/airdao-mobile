import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { RightArrowIcon } from '@components/svg/RightArrowIcon';
import { DarkNotificationIcon } from '@components/svg/icons/DarkNotification';
import { CurrencyIcon } from '@components/svg/icons/Currency';
import { LanguageIcon } from '@components/svg/icons/Language';

export const SettingsBlock = () => {
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
        <Button type="base">
          <Row style={styles.infoTextContainer} alignItems="center">
            <Text style={styles.optionButtonText}>US Dollars</Text>
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
        <Button type="base">
          <Row style={styles.infoTextContainer} alignItems="center">
            <Text style={styles.optionButtonText}>English</Text>
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
        <Button type="base">
          <Row style={styles.infoTextContainer} alignItems="center">
            <RightArrowIcon />
          </Row>
        </Button>
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
