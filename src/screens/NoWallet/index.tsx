import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { Row, Spacer, Text } from '@components/base';
import { useSelectedWalletHash } from '@hooks';
import { HomeNavigationProp } from '@appTypes';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { NoWalletLoading, StepCircle } from './components';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';

interface StepInfo {
  image: ImageSourcePropType;
  title: string;
  description: string;
}

const steps: StepInfo[] = [
  {
    image: require('@assets/images/send-receive.png'),
    title: 'no.wallet.send.receive',
    description: 'no.wallet.send.receive.description'
  },
  {
    image: require('@assets/images/address-tracking.png'),
    title: 'no.wallet.address.tracking',
    description: 'no.wallet.address.tracking.description'
  },
  {
    image: require('@assets/images/stay-informed.png'),
    title: 'no.wallet.stay.informed',
    description: 'no.wallet.stay.informed.description'
  }
];

export const NoWalletScreen = () => {
  const { data: hash, loading } = useSelectedWalletHash();
  const navigation = useNavigation<HomeNavigationProp>();
  const [currentStep, setCurrentStep] = useState(0);
  const { width: WINDOW_WIDTH } = useWindowDimensions();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && hash) {
      // navigation.navigate('HomeScreen');
    }
  }, [loading, hash, navigation]);

  const onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setCurrentStep(
      Math.floor(event.nativeEvent.contentOffset.x / WINDOW_WIDTH)
    );
  };

  const renderStep = (step: StepInfo) => {
    return (
      <View style={styles.stepContainer} key={step.title}>
        <Image
          source={step.image}
          blurRadius={0}
          style={{ width: '100%' }}
          resizeMode="cover"
        />
        <Spacer value={verticalScale(42)} />
        <View style={{ paddingHorizontal: scale(20) }}>
          <Text
            fontSize={20}
            fontFamily="Inter_700Bold"
            color={COLORS.neutral900}
            align="center"
          >
            {t(step.title)}
          </Text>
          <Spacer value={verticalScale(8)} />
          <Text
            fontSize={16}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral900}
            align="center"
          >
            {t(step.description)}
          </Text>
        </View>
      </View>
    );
  };

  const navigateToNewWallet = () => {
    navigation.navigate('CreateWalletStep0');
  };

  const navigateToImportWallet = () => {
    navigation.navigate('RestoreWalletScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <NoWalletLoading />}
      {!loading && (
        <View style={styles.container}>
          <View style={{ flex: 5 }}>
            <ScrollView
              bounces={false}
              onMomentumScrollEnd={onScrollEndDrag}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
            >
              {steps.map(renderStep)}
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
                Create new wallet
              </Text>
            </PrimaryButton>
            <Spacer value={verticalScale(24)} />
            <SecondaryButton onPress={navigateToImportWallet}>
              <Text
                fontSize={16}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral900}
              >
                Import existing wallet
              </Text>
            </SecondaryButton>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
