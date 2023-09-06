import React from 'react';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { Spacer, Text } from '@components/base';
import { SuccessIcon } from '@components/svg/icons';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '@components/modular';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import { SafeAreaView, StyleSheet, View } from 'react-native';

export const SuccessSetupSecurity = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const { t } = useTranslation();

  const navigateToSetUpSecurity = () => {
    navigation.navigate('HomeScreen');
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SuccessIcon />
        <Text
          align="center"
          fontSize={24}
          fontFamily="Inter_700Bold"
          color={COLORS.nero}
        >
          Security Enabled!
        </Text>
        <Spacer value={verticalScale(12)} />
        <Text
          align="center"
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.nero}
        >
          Your wallet is now protected. Go to{' '}
          <Text fontFamily="Inter_600SemiBold">Settings{'>'}Security</Text> to
          manage your wallet security.
        </Text>
      </View>
      <PrimaryButton
        onPress={navigateToSetUpSecurity}
        style={{ paddingHorizontal: scale(16) }}
      >
        <Text
          align="center"
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.white}
        >
          Start using wallet
        </Text>
      </PrimaryButton>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(27)
  }
});
