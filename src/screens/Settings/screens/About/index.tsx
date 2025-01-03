import React from 'react';
import { Linking, View } from 'react-native';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Spacer, Text } from '@components/base';
import { Header } from '@components/composite';
import { DebugInfo } from '@screens/Settings/screens/About/DebugInfo';
import { scale, PlatformSpecificUtils } from '@utils';
import { AboutMenutItem } from './About.MenuItem';
import { styles } from './styles';

// TODO add privacy policy and terms links
export const AboutScreen = () => {
  const { t } = useTranslation();
  const isProd = Updates.channel === 'prod';
  const { nativeAppVersion, nativeBuildVersion } = Constants;

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Header
          bottomBorder
          title={t('settings.about')}
          style={styles.header}
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
        <Spacer value={10} />
        <Button type="base" onPress={PlatformSpecificUtils.requestReview}>
          <AboutMenutItem title={t('settings.about.rate')} />
        </Button>
        {!isProd && <DebugInfo />}
      </View>
      <Text style={styles.version} fontSize={scale(16)} align="center">{`${t(
        'settings.version'
      )} ${nativeAppVersion} ${
        !isProd ? `build: ${nativeBuildVersion}` : ''
      }`}</Text>
    </SafeAreaView>
  );
};
