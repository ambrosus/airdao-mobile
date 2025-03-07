import { Linking, View } from 'react-native';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Spacer, Text } from '@components/base';
import { Header } from '@components/composite';
import { scale, PlatformSpecificUtils } from '@utils';
import { AboutMenutItem } from './About.MenuItem';
import { styles } from './styles';

export const AboutScreen = () => {
  const { t } = useTranslation();

  const nativeAppVersion = Constants.expoConfig?.version;
  // const nativeBuildVersion = isAndroid
  //   ? Constants.expoConfig?.android?.versionCode
  //   : Constants.expoConfig?.ios?.buildNumber;

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

        {/*{(__DEV__ || isTestnet) && (*/}
        {/*  <ScrollView style={{ maxHeight: '70%' }}>*/}
        {/*    <Spacer value={10} />*/}
        {/*    <DebugInfo />*/}
        {/*  </ScrollView>*/}
        {/*)}*/}
      </View>
      <Text style={styles.version} fontSize={scale(16)} align="center">{`${t(
        'settings.version'
      )} ${nativeAppVersion}`}</Text>
    </SafeAreaView>
  );
};
