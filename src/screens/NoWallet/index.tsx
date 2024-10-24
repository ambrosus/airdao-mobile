import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { BottomAwareSafeAreaView } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { RootNavigationProp } from '@appTypes';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';
import { useAddWalletContext } from '@contexts';
import { styles } from './styles';
import { NoWalletPageIcon } from '@components/svg/icons/v2';
import { LinearGradient } from 'expo-linear-gradient';

export const NoWalletScreen = () => {
  const { setWalletName, setMnemonicLength } = useAddWalletContext();
  const navigation = useNavigation<RootNavigationProp>();
  const { t } = useTranslation();

  const navigateToNewWallet = () => {
    setWalletName('');
    setMnemonicLength(128);
    navigation.navigate('Tabs', {
      screen: 'Wallets',
      params: { screen: 'CreateWalletStep0' }
    });
  };

  const navigateToImportWallet = () => {
    setWalletName('');
    setMnemonicLength(128);
    navigation.navigate('Tabs', {
      screen: 'Wallets',
      params: { screen: 'ImportWalletMethods' }
    });
  };

  return (
    <LinearGradient colors={[COLORS.brand200, 'white']}>
      <SafeAreaView style={styles.container}>
        <NoWalletPageIcon />
        <BottomAwareSafeAreaView style={styles.buttons}>
          <PrimaryButton onPress={navigateToNewWallet}>
            <Text
              fontSize={16}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral0}
            >
              {t('no.wallet.create.new')}
            </Text>
          </PrimaryButton>
          <Spacer value={verticalScale(24)} />
          <SecondaryButton onPress={navigateToImportWallet}>
            <Text
              fontSize={16}
              fontFamily="Inter_500Medium"
              color={COLORS.brand500}
            >
              {t('no.wallet.import')}
            </Text>
          </SecondaryButton>
        </BottomAwareSafeAreaView>
      </SafeAreaView>
    </LinearGradient>
  );
};
