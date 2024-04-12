import React from 'react';
import { Linking, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Updates from 'expo-updates';
import { Button, Row, Spacer, Text } from '@components/base';
import { ChevronDownIcon } from '@components/svg/icons';
import { SettingsTabNavigationProp } from '@appTypes';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import Config from '@constants/config';
import { SETTINGS_MENU_ITEMS } from './Settings.constants';
import { SettingsMenuItem } from './Settings.types';
import { styles } from './styles';
import { isAndroid } from '@utils/isPlatform';

const stageBuildVersions = {
  ios: '1.1.0.39',
  android: '1.1.5.30'
};

const isStage = Updates.channel === 'stage';
const SettingsMenuItemView = (props: { item: SettingsMenuItem }) => {
  const { item } = props;
  const { t } = useTranslation();
  const navigation = useNavigation<SettingsTabNavigationProp>();
  const navigateToRoute = () => {
    navigation.navigate(item.route);
  };

  const openLink = (link: string) => {
    Linking.openURL(link).then();
  };

  const onPress = () => {
    switch (item.key) {
      case 'helpCenter': {
        openLink(Config.AIRDAO_FAQ_URL);
        break;
      }
      case 'xTwitter': {
        openLink(Config.AIRDAO_X_TWITTER_URL);
        break;
      }
      case 'telegram': {
        openLink(Config.AIRDAO_TELEGRAM_URL);
        break;
      }
      case 'medium': {
        openLink(Config.AIRDAO_MEDIUM_URL);
        break;
      }
      default: {
        navigateToRoute();
      }
    }
  };

  return (
    <Button style={styles.menuItem} onPress={onPress}>
      <Row alignItems="center" justifyContent="space-between">
        <Row alignItems="center">
          {item.icon}
          <Spacer value={scale(8)} horizontal />
          <Text
            fontSize={16}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral900}
          >
            {t(item.title)}
          </Text>
        </Row>
        <ChevronDownIcon rotate="270deg" color={COLORS.neutral300} />
      </Row>
    </Button>
  );
};

export const SettingsScreen = () => {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const currentBuild = isAndroid
    ? stageBuildVersions.android
    : stageBuildVersions.ios;

  const renderMenu = (item: SettingsMenuItem[], index: number) => {
    const isNeedDelimiter = index + 1 !== SETTINGS_MENU_ITEMS.length;
    return (
      <View key={`${item[0].key}`}>
        {item.map(
          (menuItem): JSX.Element => (
            <SettingsMenuItemView item={menuItem} key={menuItem.route} />
          )
        )}
        {isNeedDelimiter && (
          <View
            style={{
              backgroundColor: COLORS.neutral100,
              height: 1,
              marginVertical: 5
            }}
          />
        )}
      </View>
    );
  };

  return (
    <View style={[{ top }, styles.container]}>
      <Text fontSize={24} fontFamily="Inter_700Bold" color={COLORS.neutral800}>
        {t('tab.settings')}
      </Text>
      <View style={styles.innerContainer}>
        {SETTINGS_MENU_ITEMS.map(renderMenu)}
      </View>
      {isStage && (
        <Text style={{ margin: 20 }}>{`Build: ${currentBuild}`}</Text>
      )}
    </View>
  );
};
