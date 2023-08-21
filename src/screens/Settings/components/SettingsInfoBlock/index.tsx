import React from 'react';
import { Linking, Platform, View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { HelpIcon } from '@components/svg/icons/Help';
import { AppStoreIcon, PlayStoreIcon } from '@components/svg/icons';
import { PlatformSpecificUtils } from '@utils/platform';
import { styles } from './style';
import { useTranslation } from 'react-i18next';

export const SettingsInfoBlock = () => {
  const { t } = useTranslation();
  const openLink = () => {
    Linking.openURL('https://airdao.academy/faqs');
  };

  return (
    <View testID="Settings_Screen_Settings_Info_Block">
      <Spacer value={42} />
      <Button type="base" onPress={openLink}>
        <Row alignItems="center">
          <HelpIcon />
          <Text style={styles.infoTextContainer}>{t('help.centerBtn')}</Text>
        </Row>
      </Button>
      <Spacer value={43} />
      <Button type="base" onPress={PlatformSpecificUtils.requestReview}>
        <Row alignItems="center">
          {Platform.select({
            ios: <AppStoreIcon />,
            android: <PlayStoreIcon />
          })}
          <Text style={styles.infoTextContainer}>
            {Platform.select({
              ios: t('rate.btn.ios'),
              android: t('rate.btn.android')
            })}
          </Text>
        </Row>
      </Button>
    </View>
  );
};
