import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SettingsBlock } from '@screens/Settings/components/SettingsBlock';
import { COLORS } from '@constants/colors';
import { SettingsInfoBlock } from '@screens/Settings/components/SettingsInfoBlock';
import { scale, verticalScale } from '@utils/scaling';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacer, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { useNavigation } from '@react-navigation/native';
import { SettingsTabNavigationProp } from '@appTypes';

export const SettingsScreen = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation<SettingsTabNavigationProp>();
  const navigateToWalletConnect = () => {
    navigation.navigate('AddWalletStack', { screen: 'AddWalletScreen' });
  };
  return (
    <View style={[{ top }, styles.container]} testID="Settings_Screen">
      <SettingsBlock />
      <View style={styles.separator} />
      <SettingsInfoBlock />
      <Spacer value={verticalScale(24)} />
      <PrimaryButton onPress={navigateToWalletConnect}>
        <Text color={COLORS.white}>Go to Wallet Connect</Text>
      </PrimaryButton>
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: COLORS.separator,
    width: '100%'
  },
  container: {
    paddingLeft: scale(19),
    paddingRight: scale(23)
  }
});
