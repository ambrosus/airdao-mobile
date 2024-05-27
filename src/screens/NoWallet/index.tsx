import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { BottomAwareSafeAreaView } from '@components/composite';
import { Input, Row, Spacer, Text } from '@components/base';
import { RootNavigationProp } from '@appTypes';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { useAddWalletContext } from '@contexts';
import { NoWalletStep, StepCircle, StepInfo } from './components';
import { NoWalletSteps } from './NoWallet.constants';
import { styles } from './styles';
import { UID } from '@lib';
import { getModel, getUniqueId } from 'react-native-device-info';

export const NoWalletScreen = () => {
  const [showID, setShowID] = useState(false);
  const showIDs = () => setShowID(!showID);

  const ShowIDs = () => {
    // only for dev
    const [ID, setID] = useState('');
    const [UniqueId, setUnique] = useState('');
    const model = getModel().replace(/\s/g, '');
    useEffect(() => {
      const getIDs = async () => {
        const _ID = await UID();
        setID(_ID);
      };
      const getUniqueIds = async () => {
        const UNIQUE = await getUniqueId();
        setUnique(UNIQUE);
      };
      getUniqueIds().then();
      getIDs().then();
    }, []);
    return (
      <View>
        <Text style={{ marginLeft: 5 }}>DEVICE NAME</Text>
        <Input value={model} />
        <Spacer value={10} />

        <Text style={{ marginLeft: 5 }}>DEVICE UID</Text>
        <Input value={UniqueId} />
        <Spacer value={10} />

        <Text style={{ marginLeft: 5 }}>ID TO HASH</Text>
        <Input value={`${UniqueId}${model}`} />
        <Spacer value={10} />

        <Text style={{ marginLeft: 5 }}>UID-HASH TO BACKEND</Text>
        <Input value={ID} />
        <Spacer value={10} />
      </View>
    );
  };
  // only for dev

  const { setWalletName, setMnemonicLength } = useAddWalletContext();
  const navigation = useNavigation<RootNavigationProp>();
  const [currentStep, setCurrentStep] = useState(0);
  const { width: WINDOW_WIDTH } = useWindowDimensions();
  const { t } = useTranslation();

  const onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setCurrentStep(
      Math.floor(
        event.nativeEvent.contentOffset.x / parseInt(WINDOW_WIDTH.toString())
      )
    );
  };

  const renderStep = (step: StepInfo) => {
    return <NoWalletStep key={step.title} step={step} />;
  };

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
      params: { screen: 'ImportWallet' }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 5 }}>
        <ScrollView
          bounces={false}
          onMomentumScrollEnd={onScrollEndDrag}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          {/*TODO remove from prod*/}
          <TouchableOpacity onPress={showIDs} activeOpacity={1}>
            {showID ? <ShowIDs /> : NoWalletSteps.map(renderStep)}
          </TouchableOpacity>
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
            color={COLORS.neutral900}
          >
            {t('no.wallet.import')}
          </Text>
        </SecondaryButton>
      </BottomAwareSafeAreaView>
    </SafeAreaView>
  );
};
