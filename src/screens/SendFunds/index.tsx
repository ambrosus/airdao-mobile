import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Keyboard, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { KeyboardDismissingView, Spacer, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useEstimatedTransferFee, useTokensAndTransactions } from '@hooks';
import { verticalScale } from '@utils/scaling';
import { AirDAOEventType, CryptoCurrencyCode, HomeParamsList } from '@appTypes';
import { ethereumAddressRegex } from '@constants/regex';
import { AddressInput, ConfirmTransaction } from './components';
import { AirDAOEventDispatcher } from '@lib';
import { Token } from '@models';
import { TransactionUtils } from '@utils/transaction';
import { NumberUtils } from '@utils/number';
import { styles } from './styles';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics/sendFirebaseEvent';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';
import {
  useAMBEntity,
  useAmountChangeHandler
} from '@features/send-funds/lib/hooks';
import { InputWithTokenSelect } from '@components/templates';
import { TokensList } from '@features/send-funds/components/composite';
import { AmountSelectionKeyboardExtend } from '@features/send-funds/components/modular';
import { FundsHeader } from '@features/send-funds/components/templates';
import { useWalletStore } from '@entities/wallet';
import { useSendFundsStore } from '@features/send-funds';
import { _delayNavigation } from '@utils';

type Props = NativeStackScreenProps<HomeParamsList, 'SendFunds'>;

export const SendFunds = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const { state, onChangeState, onResetState } = useSendFundsStore();

  useFocusEffect(
    useCallback(() => {
      return () => {
        onResetState();
      };
    }, [onResetState])
  );

  const tokenFromNavigationParams = route.params?.token;
  const bottomSheetTokensListRef = useRef<BottomSheetRef>(null);

  const [isTextInputActive, setIsTextInputActive] = useState(false);

  const {
    to: destinationAddress = '',
    from: senderAddress = '',
    transactionId
  } = state;

  const transactionIdRef = useRef('');

  const { wallet: account } = useWalletStore();
  const walletHash = account?.wallet.id ?? '';

  const _AMBEntity = useAMBEntity(senderAddress);

  useEffect(() => {
    if (transactionId) transactionIdRef.current = transactionId;
  }, [transactionId]);

  const {
    data: { tokens },
    loading: isFetchingTokens
  } = useTokensAndTransactions(senderAddress || '', 1, 20, !!senderAddress);

  const [selectedToken, setSelectedToken] = useState<Token>(
    tokens.find(
      (token) => token.address === tokenFromNavigationParams?.address
    ) || _AMBEntity
  );

  const { amountInCrypto, setAmountInCrypto, onChangeAmountHandle } =
    useAmountChangeHandler();

  // calculate estimated fee
  const estimatedFee = useEstimatedTransferFee(
    selectedToken,
    parseFloat(amountInCrypto),
    senderAddress,
    destinationAddress
  );
  const confirmModalRef = useRef<BottomSheetRef>(null);

  const onSelectToken = useCallback((token: Token) => {
    bottomSheetTokensListRef.current?.dismiss();
    setSelectedToken(token);
  }, []);

  useEffect(() => {
    onChangeState({
      estimatedFee,
      currency: selectedToken.symbol as CryptoCurrencyCode,
      amount: parseFloat(amountInCrypto)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estimatedFee, selectedToken, amountInCrypto]);

  const setDestinationAddress = (address: string) => {
    onChangeState({ to: address });
  };

  const onPressMaxAmount = useCallback(
    (maxBalanceString?: string, decimals = 3) => {
      if (maxBalanceString) {
        let maxSpendableBalance: number = +maxBalanceString;

        if (selectedToken.name === 'AirDAO') {
          maxSpendableBalance -= 0.0005;
        }

        setAmountInCrypto(
          NumberUtils.limitDecimalCount(
            maxSpendableBalance.toString(),
            decimals
          )
        );
      }
    },
    [selectedToken.name, setAmountInCrypto]
  );

  const showReviewModal = () => {
    Keyboard.dismiss();

    return setTimeout(() => {
      confirmModalRef.current?.show();
    }, 525);
  };

  const hideReviewModal = () => {
    confirmModalRef.current?.dismiss();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sendTx = useCallback(() => {
    const txId = new Date().getTime().toString();
    onChangeState({
      loading: true,
      transactionId: txId,
      success: false
    });

    setTimeout(async () => {
      try {
        AirDAOEventDispatcher.dispatch(AirDAOEventType.FundsSentFromApp, {
          from: senderAddress,
          to: destinationAddress
        });

        sendFirebaseEvent(CustomAppEvents.send_start);
        await TransactionUtils.sendTx(
          walletHash,
          senderAddress,
          destinationAddress,
          Number(amountInCrypto),
          selectedToken
        );

        if (transactionIdRef.current === txId) {
          sendFirebaseEvent(CustomAppEvents.send_finish);
          onChangeState({
            loading: false,
            success: true
          });
        }
      } catch (error: unknown) {
        await Clipboard.setStringAsync(JSON.stringify(error));

        const errorMessage =
          (error as { message: string })?.message ?? JSON.stringify(error);
        sendFirebaseEvent(CustomAppEvents.send_error, {
          sendError: errorMessage
        });

        if (transactionIdRef.current === txId) {
          onChangeState({
            loading: false,
            error: error as unknown as never
          });
        }
      }
    }, 1000);
  }, [
    amountInCrypto,
    destinationAddress,
    onChangeState,
    selectedToken,
    senderAddress,
    walletHash
  ]);

  const reviewButtonDisabled = useMemo(
    () =>
      Number(amountInCrypto) === 0 ||
      !destinationAddress.match(ethereumAddressRegex),
    [amountInCrypto, destinationAddress]
  );

  const renderBottomSheetNode = useMemo(
    () => (
      <TokensList
        tokens={[_AMBEntity].concat(tokens)}
        selectedToken={selectedToken}
        onSelectToken={onSelectToken}
        isFetchingTokens={isFetchingTokens}
      />
    ),
    [_AMBEntity, isFetchingTokens, onSelectToken, selectedToken, tokens]
  );

  const onTextInputFocus = useCallback(() => setIsTextInputActive(true), []);
  const onTextInputBlur = useCallback(() => setIsTextInputActive(false), []);

  const onPercentItemPress = useCallback(
    (percent: number) => {
      const MAXIMUM_AVAILABLE_VALUE = 100;

      if (percent === MAXIMUM_AVAILABLE_VALUE)
        return onPressMaxAmount(
          selectedToken.balance.formattedBalance,
          selectedToken.decimals
        );

      const newValueInCrypto = String(
        (+selectedToken.balance.formattedBalance * percent) / 100
      );
      setAmountInCrypto(newValueInCrypto);
    },
    [onPressMaxAmount, selectedToken, setAmountInCrypto]
  );
  const buttonTitle = useMemo(() => {
    return reviewButtonDisabled
      ? t('button.enter.amount')
      : t('send.funds.review.transaction');
  }, [reviewButtonDisabled, t]);

  const onSuccessBottomSheetDismiss = useCallback(() => {
    if (state.success) {
      return _delayNavigation(hideReviewModal, () =>
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'HomeScreen' }]
          })
        )
      );
    }
  }, [navigation, state.success]);

  const isBottomSheetHasTitle = useMemo(() => {
    const { error, success } = state;

    return Boolean(error) || Boolean(success);
  }, [state]);

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <FundsHeader sender={senderAddress} />

        <KeyboardDismissingView style={styles.container}>
          <View style={styles.horizontalPadding}>
            <AddressInput
              address={destinationAddress}
              onAddressChange={setDestinationAddress}
            />
            {destinationAddress.length > 0 &&
              !destinationAddress.match(ethereumAddressRegex) && (
                <View style={styles.addressError}>
                  <Text fontSize={12} color={COLORS.error400}>
                    {t('send.funds.invalid.address')}
                  </Text>
                </View>
              )}
          </View>

          <View style={styles.innerContainer}>
            <View style={styles.wrapper}>
              <InputWithTokenSelect
                ref={bottomSheetTokensListRef}
                title={t('token.picker.select')}
                label="Set amount"
                dispatch={false}
                value={amountInCrypto}
                token={selectedToken}
                onChangeText={onChangeAmountHandle}
                onPressMaxAmount={(value) => onPressMaxAmount(value)}
                bottomSheetNode={renderBottomSheetNode}
                onFocus={onTextInputFocus}
                onBlur={onTextInputBlur}
                resetKeyboardState
              />

              <Spacer value={verticalScale(32)} />
              <PrimaryButton
                disabled={reviewButtonDisabled}
                onPress={showReviewModal}
              >
                <Text
                  color={
                    reviewButtonDisabled ? COLORS.alphaBlack30 : COLORS.neutral0
                  }
                  fontSize={16}
                  fontFamily="Inter_500Medium"
                  fontWeight="500"
                >
                  {buttonTitle}
                </Text>
              </PrimaryButton>
            </View>
          </View>
          <BottomSheet
            ref={confirmModalRef}
            title={!isBottomSheetHasTitle ? t('common.review') : undefined}
            swiperIconVisible={false}
            onBackdropPress={onSuccessBottomSheetDismiss}
            onCustomCrossPress={onSuccessBottomSheetDismiss}
          >
            <ConfirmTransaction
              from={senderAddress}
              to={destinationAddress}
              etherAmount={parseFloat(amountInCrypto)}
              currency={selectedToken.symbol}
              estimatedFee={estimatedFee}
              onSendPress={sendTx}
              dismissBottomSheet={onSuccessBottomSheetDismiss}
            />
          </BottomSheet>
        </KeyboardDismissingView>
        <AmountSelectionKeyboardExtend
          isTextInput={isTextInputActive}
          onPercentItemPress={onPercentItemPress}
        />
      </SafeAreaView>
    </>
  );
};
