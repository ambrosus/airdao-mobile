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
import { useWalletStore } from '@entities/wallet';
import { useStakeHBRActionsStore } from '@features/harbor';
import { BottomSheetReviewAMBTransactionWithAction } from '@features/harbor/components/templates';
import { useAMBEntity } from '@features/send-funds/lib/hooks';
import {
  keyboardAvoidingViewOffsetWithNotchSupportedValue,
  useKeyboardContainerStyleWithSafeArea
} from '@hooks';
import { NumberUtils, scale } from '@utils';
import { styles } from './styles';

type Props = NativeStackScreenProps<HarborTabParamsList, 'StakeAMBScreen'>;

export const StakeAMBScreen = ({ route }: Props) => {
  const { t } = useTranslation();
  const { stake, limitsConfig } = useStakeHBRStore();
  const { ambAmount, onChangeAMBAmountToStake } = useStakeHBRActionsStore();
  const { wallet } = useWalletStore();
  const footerStyle = useKeyboardContainerStyleWithSafeArea(styles.footer);

  const ambInstance = useAMBEntity(wallet?.address ?? '');

  const [inputError, setInputError] = useState('');

  const bottomSheetReviewTxRef = useRef<BottomSheetRef>(null);

  useFocusEffect(
    useCallback(() => {
      return () => {
        onChangeAMBAmountToStake('');
      };
    }, [onChangeAMBAmountToStake])
  );

  useMemo(() => {
    if (ambAmount) {
      const greaterThenBalance = ethers.utils
        .parseEther(ambAmount)
        .gt(ambInstance.balance.wei);
      if (greaterThenBalance) {
        setInputError(t('bridge.insufficient.funds'));
      } else {
        setInputError('');
      }
    }
  }, [ambAmount, ambInstance.balance.wei, t]);

  const disabled = useMemo(
    () => !!inputError || !ambAmount,
    [ambAmount, inputError]
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

  const onButtonPress = useCallback(() => {
    Keyboard.dismiss();

    if (ethers.utils.parseEther(ambAmount).lt(limitsConfig.minStakeValue)) {
      return setInputError(
        `Min ${NumberUtils.formatNumber(
          +ethers.utils.formatEther(limitsConfig.minStakeValue)
        )} ${CryptoCurrencyCode.AMB}`
      );
    }

    setTimeout(
      () => bottomSheetReviewTxRef.current?.show(),
      KEYBOARD_OPENING_TIME
    );
  }, [ambAmount, limitsConfig.minStakeValue]);

  return (
    <SafeAreaView style={styles.container}>
      <Header contentCenter={renderHeaderCenterNode} />
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={keyboardAvoidingViewOffsetWithNotchSupportedValue(
          8
        )}
        style={styles.justifyContent}
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
              error={inputError}
              tokenInstance={ambInstance}
            />
          </View>
        </TouchableWithoutFeedback>

        <View style={footerStyle}>
          <PrimaryButton disabled={disabled} onPress={onButtonPress}>
            <TextOrSpinner
              loading={false}
              loadingLabel={undefined}
              label={t('button.confirm')}
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
      />
    </SafeAreaView>
  );
};
