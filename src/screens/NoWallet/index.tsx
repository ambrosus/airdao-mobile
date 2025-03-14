import { useRef } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import { RootNavigationProp } from '@appTypes';
import { Spacer, Text } from '@components/base';
import { BottomAwareSafeAreaView } from '@components/composite';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useAddWalletStore } from '@features/add-wallet';
import { useEffectOnce } from '@hooks';
import { scale, verticalScale } from '@utils';
import { styles } from './styles';

export const NoWalletScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<RootNavigationProp>();

  const { onChangeName, onChangeMnemonicLength } = useAddWalletStore();

  const animationRef = useRef<LottieView>(null);
  useEffectOnce(() => {
    animationRef.current?.play();
    setInterval(() => animationRef.current?.play(), 5000);
  });

  const navigateToAddWallet = (
    screen: 'ImportWalletMethods' | 'CreateWalletStep0'
  ) => {
    onChangeName('');
    onChangeMnemonicLength(128);
    navigation.replace('Tabs', {
      screen: 'Settings',
      params: {
        screen,
        params: { from: 'WelcomeScreen' }
      }
    });
  };

  return (
    <LinearGradient colors={[COLORS.brand200, 'white']}>
      <View style={styles.container}>
        <LottieView
          ref={animationRef}
          style={styles.animationContainer}
          loop={false}
          source={require('../../assets/lottie/welcomeScreen.json')}
        />
        <Spacer value={verticalScale(15)} />
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Spacer value={verticalScale(5)} />
          <Text style={[styles.welcomeText, styles.airDaoText]}>
            AirDAO Wallet
          </Text>
          <Spacer value={verticalScale(20)} />
          <Text style={styles.infoText}>Wallet - Trade - DeFi</Text>
          <Spacer value={verticalScale(30)} />
        </View>
        <BottomAwareSafeAreaView style={styles.buttons}>
          <PrimaryButton
            onPress={() => navigateToAddWallet('CreateWalletStep0')}
          >
            <Text
              fontSize={scale(17)}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral0}
            >
              {t('no.wallet.create.new')}
            </Text>
          </PrimaryButton>
          <Spacer value={verticalScale(24)} />
          <SecondaryButton
            onPress={() => navigateToAddWallet('ImportWalletMethods')}
          >
            <Text
              fontSize={scale(17)}
              fontFamily="Inter_600SemiBold"
              color={COLORS.brand500}
            >
              {t('no.wallet.import')}
            </Text>
          </SecondaryButton>
        </BottomAwareSafeAreaView>
      </View>
    </LinearGradient>
  );
};
