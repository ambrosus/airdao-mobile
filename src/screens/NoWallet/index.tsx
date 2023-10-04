import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { Row, Spacer, Text } from '@components/base';
import { RootNavigationProp } from '@appTypes';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { AddWalletFlowType, useAddWalletContext } from '@contexts';
import { NoWalletStep, StepCircle, StepInfo } from './components';
import { NoWalletSteps } from './NoWallet.constants';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';

export const NoWalletScreen = () => {
  const { setFlowType, setWalletName, setMnemonicLength } =
    useAddWalletContext();
  const navigation = useNavigation<RootNavigationProp>();
  const [currentStep, setCurrentStep] = useState(0);
  const { width: WINDOW_WIDTH } = useWindowDimensions();
  const { t } = useTranslation();

  const onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setCurrentStep(
      Math.floor(event.nativeEvent.contentOffset.x / WINDOW_WIDTH)
    );
  };

  const renderStep = (step: StepInfo) => {
    return <NoWalletStep key={step.title} step={step} />;
  };

  const navigateToNewWallet = () => {
    setFlowType(AddWalletFlowType.CREATE_WALLET);
    setWalletName('');
    setMnemonicLength(128);
    navigation.navigate('Tabs', {
      screen: 'Wallets',
      params: { screen: 'CreateWalletStep0' }
    });
  };

  const navigateToImportWallet = () => {
    setFlowType(AddWalletFlowType.RESTORE_WALLET);
    setWalletName('');
    setMnemonicLength(128);
    navigation.navigate('Tabs', {
      screen: 'Wallets',
      params: { screen: 'RestoreWalletScreen' }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={{ flex: 5 }}>
          <ScrollView
            bounces={false}
            onMomentumScrollEnd={onScrollEndDrag}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {NoWalletSteps.map(renderStep)}
          </ScrollView>
          <Spacer value={verticalScale(24)} />
          <Row
            alignItems="center"
            justifyContent="center"
            style={{ columnGap: scale(16) }}
          >
            <StepCircle step={0} currentStep={currentStep} />
            <StepCircle step={1} currentStep={currentStep} />
            <StepCircle step={2} currentStep={currentStep} />
          </Row>
        </View>
        <Spacer value={verticalScale(24)} />
        <View style={styles.buttons}>
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
              color={COLORS.neutral900}
            >
              {t('no.wallet.import')}
            </Text>
          </SecondaryButton>
        </View>
      </View>
    </SafeAreaView>
  );
};
