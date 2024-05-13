import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Header } from '@components/composite';
import { AboutMenutItem } from './About.MenuItem';
import { Button } from '@components/base';
import { PlatformSpecificUtils } from '@utils/platform';
import { styles } from './styles';
import { Linking } from 'react-native';

// TODO add privacy policy and terms links
export const AboutScreen = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <Header
        bottomBorder
        title={t('settings.about')}
        style={{ backgroundColor: 'transparent' }}
      />
      {/* <Button>
        <AboutMenutItem title={t('settings.about.terms')} />
      </Button> */}
      <Button
        onPress={() =>
          Linking.openURL('https://airdao.io/mobile-privacy-policy')
        }
      >
        <AboutMenutItem title={t('settings.about.privacy')} />
      </Button>
      <Button type="base" onPress={PlatformSpecificUtils.requestReview}>
        <AboutMenutItem title={t('settings.about.rate')} />
      </Button>
    </SafeAreaView>
  );
};
