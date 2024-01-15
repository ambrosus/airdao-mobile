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

const isStage = Updates.channel === 'stage';
const SettingsMenuItemView = (props: { item: SettingsMenuItem }) => {
  const { item } = props;
  const { t } = useTranslation();
  const navigation = useNavigation<SettingsTabNavigationProp>();
  const navigateToRoute = () => {
    navigation.navigate(item.route);
  };

  const openHelpCenter = () => {
    Linking.openURL(Config.AIRDAO_FAQ_URL);
  };

  const onPress = () => {
    switch (item.key) {
      case 'helpCenter': {
        openHelpCenter();
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
          <Spacer
            value={item.route === 'AppPreferences' ? scale(12) : scale(8)}
            horizontal
          />
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral500}
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

  const renderMenu = (item: SettingsMenuItem): JSX.Element => {
    return <SettingsMenuItemView item={item} key={item.route} />;
  };

  return (
    <View style={[{ top }, styles.container]}>
      <Text fontSize={24} fontFamily="Inter_700Bold" color={COLORS.neutral800}>
        {t('tab.settings')}
      </Text>
      <View style={styles.innerContainer}>
        {SETTINGS_MENU_ITEMS.map(renderMenu)}
      </View>
      {isStage && <Text style={{ margin: 20 }}>Build: 1.1.0.31</Text>}
    </View>
  );
};
