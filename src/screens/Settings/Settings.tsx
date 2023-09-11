import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button, Row, Spacer, Text } from '@components/base';
import { ChevronRightIcon } from '@components/svg/icons';
import { SettingsTabNavigationProp } from '@appTypes';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { SETTINGS_MENU_ITEMS } from './Settings.constants';
import { SettingsMenuItem } from './Settings.types';
import { styles } from './styles';

const SettingsMenuItemView = (props: { item: SettingsMenuItem }) => {
  const { item } = props;
  const { t } = useTranslation();
  const navigation = useNavigation<SettingsTabNavigationProp>();
  const navigateToRoute = () => {
    navigation.navigate(item.route);
  };

  return (
    <Button style={styles.menutItem} onPress={navigateToRoute}>
      <Row alignItems="center" justifyContent="space-between">
        <Row alignItems="center">
          {item.icon}
          <Spacer value={scale(8)} horizontal />
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral500}
          >
            {t(item.title)}
          </Text>
        </Row>
        <ChevronRightIcon color={COLORS.neutral300} scale={1.5} />
      </Row>
    </Button>
  );
};

export const SettingsScreen = () => {
  const { t } = useTranslation();

  const renderMenu = (item: SettingsMenuItem): JSX.Element => {
    return <SettingsMenuItemView item={item} key={item.route} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text fontSize={24} fontFamily="Inter_700Bold" color={COLORS.neutral800}>
        {t('settings.tab')}
      </Text>
      <View style={styles.innerContainer}>
        {SETTINGS_MENU_ITEMS.map(renderMenu)}
      </View>
    </SafeAreaView>
  );
};
