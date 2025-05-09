import { Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsTabNavigationProp, SettingsTabParamsList } from '@appTypes';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import Config from '@constants/config';
import { scale } from '@utils';
import { SETTINGS_MENU_ITEMS, SOCIAL_GROUPS } from './Settings.constants';
import { SettingsMenuItem } from './Settings.types';
import { styles } from './styles';

export const SettingsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<SettingsTabNavigationProp>();

  const navigateToRoute = (route: keyof SettingsTabParamsList) => {
    navigation.navigate(route as never);
  };

  const openLink = (link: string) => {
    Linking.openURL(link).then();
  };
  const onPressMenuItem = (item: SettingsMenuItem) => {
    const { key, route } = item;
    switch (key) {
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
        navigateToRoute(route);
      }
    }
  };

  const SettingsMenuItemView = (props: { item: SettingsMenuItem }) => {
    const { item } = props;
    const { t } = useTranslation();

    return (
      <Button style={styles.menuItem} onPress={() => onPressMenuItem(item)}>
        <Row alignItems="center">
          {item.icon}
          <Spacer value={scale(8)} horizontal />
          <Text
            fontSize={scale(16)}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral900}
          >
            {t(item.title)}
          </Text>
        </Row>
      </Button>
    );
  };
  const SocialItem = ({ item }: { item: SettingsMenuItem }) => {
    return (
      <TouchableOpacity onPress={() => onPressMenuItem(item)}>
        {item.icon}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <Text
          fontSize={scale(24)}
          fontFamily="Inter_700Bold"
          color={COLORS.neutral800}
        >
          {t('tab.settings')}
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.contentWrapper}
      >
        <View>
          {SETTINGS_MENU_ITEMS.map((menuItem) => (
            <SettingsMenuItemView item={menuItem} key={menuItem.route} />
          ))}
        </View>
        <Spacer value={scale(20)} />
        <View style={styles.bottomContent}>
          <View style={styles.socialButtons}>
            {SOCIAL_GROUPS.map((item) => (
              <SocialItem key={item.key} item={item} />
            ))}
          </View>
          <Spacer value={scale(5)} />
        </View>
        <Spacer value={scale(100)} />
      </ScrollView>
    </SafeAreaView>
  );
};
