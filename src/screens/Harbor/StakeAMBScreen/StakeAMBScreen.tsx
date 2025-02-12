import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CryptoCurrencyCode } from '@appTypes';
import { HarborTabParamsList } from '@appTypes/navigation/harbor';
import { Row, Spacer, Text } from '@components/base';
import { BottomSheetRef, Header, TextOrSpinner } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { KEYBOARD_OPENING_TIME } from '@constants/variables';
import { useStakeHBRStore } from '@entities/harbor';
import { HeaderAPYLabel } from '@entities/harbor/components/base';
import {
  AmbInputWithPoolDetails,
  StakedBalanceInfo
} from '@entities/harbor/components/composite';
import { bnZERO } from '@entities/harbor/constants';
import { useInputErrorStakeAMB } from '@entities/harbor/lib/hooks/use-input-error';
import { useWalletStore } from '@entities/wallet';
import { useStakeHBRActionsStore } from '@features/harbor';
import { BottomSheetReviewAMBTransactionWithAction } from '@features/harbor/components/templates';
import { useDepositAMB } from '@features/harbor/lib/hooks';
import { useAMBEntity } from '@features/send-funds/lib/hooks';
import {
  keyboardAvoidingViewOffsetWithNotchSupportedValue,
  useKeyboardContainerStyleWithSafeArea
} from '@hooks';
import { estimatedNetworkProviderFee, NumberUtils, scale } from '@utils';
import { styles } from './styles';
type Props = NativeStackScreenProps<HarborTabParamsList, 'StakeAMBScreen'>;

export const StakeAMBScreen = ({ route }: Props) => {
  const { t } = useTranslation();
  const { stake, maxUserStakeValue } = useStakeHBRStore();
  const { ambAmount, onChangeAMBAmountToStake } = useStakeHBRActionsStore();
  const { wallet } = useWalletStore();
  const footerStyle = useKeyboardContainerStyleWithSafeArea(styles.footer);
  const ambInstance = useAMBEntity(wallet?.address ?? '');
  const error = useInputErrorStakeAMB(ambInstance);

  const [loading, setLoading] = useState(false);
  // TODO: update from common consts bnZERO
  const [estimatedGas, setEstimatedGas] = useState<ethers.BigNumber>(bnZERO);

  const bottomSheetReviewTxRef = useRef<BottomSheetRef>(null);

  const availableDepositLimit = useMemo(
    () => maxUserStakeValue.sub(stake),
    [maxUserStakeValue, stake]
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        onChangeAMBAmountToStake('');
      };
    }, [onChangeAMBAmountToStake])
  );

  const label = useMemo(() => {
    if (ambAmount === '') {
      return t('button.confirm');
    }

    if (!!error) {
      return error;
    }

    return t('button.confirm');
  }, [ambAmount, error, t]);

  const disabled = useMemo(
    () =>
      loading ||
      !!error ||
      !ambAmount ||
      availableDepositLimit.lt(ethers.utils.parseEther(ambAmount)),
    [ambAmount, availableDepositLimit, error, loading]
  );

  const renderHeaderCenterNode = useMemo(() => {
    const { apy } = route.params;

    return (
      <Row alignItems="center">
        <Text
          fontSize={scale(18)}
          fontFamily="Inter_700Bold"
          color={COLORS.neutral900}
        >
          {t('harbor.stakeAMB.header')}
        </Text>
        <Spacer horizontal value={scale(8)} />
        <HeaderAPYLabel apr={apy ?? 0} />
      </Row>
    );
  }, [route.params, t]);

  const { estimateTransactionGas } = useDepositAMB();

  const onButtonPress = useCallback(async () => {
    Keyboard.dismiss();
    setLoading(true);

    try {
      const txEstimateGas = await estimateTransactionGas();
      const txGasFee = await estimatedNetworkProviderFee(txEstimateGas);
      setEstimatedGas(txGasFee);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }

    setTimeout(
      () => bottomSheetReviewTxRef.current?.show(),
      KEYBOARD_OPENING_TIME
    );
  }, [estimateTransactionGas]);

  return (
    <SafeAreaView style={styles.container}>
      <Header contentCenter={renderHeaderCenterNode} />
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.justifyContent}
        keyboardVerticalOffset={keyboardAvoidingViewOffsetWithNotchSupportedValue(
          8
        )}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <StakedBalanceInfo
              title={t('harbor.staked.balance')}
              coin={CryptoCurrencyCode.AMB}
              stakedValue={NumberUtils.numberToTransformedLocale(
                NumberUtils.limitDecimalCount(
                  +ethers.utils.formatEther(stake),
                  2
                )
              )}
            />

            <AmbInputWithPoolDetails
              error={undefined}
              tokenInstance={ambInstance}
            />
          </View>
        </TouchableWithoutFeedback>

        <View style={footerStyle}>
          <PrimaryButton disabled={disabled} onPress={onButtonPress}>
            <TextOrSpinner
              loading={loading}
              spinnerColor={COLORS.brand400}
              label={label}
              styles={{
                active: {
                  fontSize: 14,
                  fontFamily: 'Inter_500Medium',
                  color: disabled ? COLORS.neutral500 : COLORS.neutral0
                }
              }}
            />
          </PrimaryButton>
        </View>
      </KeyboardAvoidingView>

      <BottomSheetReviewAMBTransactionWithAction
        ref={bottomSheetReviewTxRef}
        apy={route.params.apy ?? 0}
        estimatedGas={estimatedGas}
      />
    </SafeAreaView>
  );
};
