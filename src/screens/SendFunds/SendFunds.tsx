import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback
} from 'react';
import { Keyboard, KeyboardAvoidingView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { BottomSheetRef, Header } from '@components/composite';
import { Button, KeyboardDismissingView, Spacer, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import {
  useEstimatedTransferFee,
  useTokensAndTransactions,
  useWallet
} from '@hooks';
import { scale, verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import {
  AirDAOEventType,
  CryptoCurrencyCode,
  HomeNavigationProp,
  HomeParamsList
} from '@appTypes';
import { ethereumAddressRegex } from '@constants/regex';
import { useSendCryptoContext } from '@contexts';
import { AddressInput } from './components';
import { AirDAOEventDispatcher } from '@lib';
import { Token } from '@models';
import { TransactionUtils } from '@utils/transaction';
import { NumberUtils } from '@utils/number';
import { styles } from './styles';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics/sendFirebaseEvent';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';
import { BarcodeScannerIcon } from '@components/svg/icons/v2';
import {
  useAMBEntity,
  useAmountChangeHandler
} from '@features/send-funds/lib/hooks';
import { InputWithTokenSelect } from '@components/templates';
import { TokensList } from '@features/send-funds/components/composite';

export const SendFunds = () => {
  const { state: sendContextState, reducer: updateSendContext } =
    useSendCryptoContext((v) => v);
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<RouteProp<HomeParamsList, 'SendFunds'>>();
  const tokenFromNavigationParams = route.params?.token;

  const bottomSheetTokensListRef = useRef<BottomSheetRef>(null);

  const {
    to: destinationAddress = '',
    from: senderAddress = '',
    transactionId
  } = sendContextState;

  const transactionIdRef = useRef('');
  // const amountInputRef = useRef<InputRef>(null);

  const { wallet: account } = useWallet();
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
    updateSendContext({
      type: 'SET_DATA',
      estimatedFee,
      currency: selectedToken.symbol as CryptoCurrencyCode,
      amount: parseFloat(amountInCrypto)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estimatedFee, selectedToken, amountInCrypto]);

  const setDestinationAddress = (address: string) => {
    updateSendContext({ type: 'SET_DATA', to: address });
  };

  const onPressMaxAmount = useCallback(
    (maxBalanceString?: string) => {
      if (maxBalanceString) {
        let maxSendableBalance: number = +maxBalanceString;

        if (selectedToken.name === 'AirDAO') {
          maxSendableBalance -= 0.0005;
        }

        setAmountInCrypto(
          NumberUtils.limitDecimalCount(maxSendableBalance.toString(), 3)
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
  const sendTx = () => {
    hideReviewModal();
    const txId = new Date().getTime().toString();
    updateSendContext({ type: 'SET_DATA', loading: true, transactionId: txId });
    setTimeout(async () => {
      try {
        AirDAOEventDispatcher.dispatch(AirDAOEventType.FundsSentFromApp, {
          from: senderAddress,
          to: destinationAddress
        });
        navigation.replace('SendFundsStatus');
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
          updateSendContext({ type: 'SET_DATA', loading: false });
        }
      } catch (error: unknown) {
        await Clipboard.setStringAsync(JSON.stringify(error));
        // @ts-ignore
        const errorMessage = error?.message ?? JSON.stringify(error);
        sendFirebaseEvent(CustomAppEvents.send_error, {
          sendError: errorMessage
        });

        if (transactionIdRef.current === txId) {
          updateSendContext({
            type: 'SET_DATA',
            loading: false,
            error: error as unknown as never
          });
        }
      }
    }, 1000);
  };

  const reviewButtonDisabled = useMemo(
    () =>
      Number(amountInCrypto) === 0 ||
      !destinationAddress.match(ethereumAddressRegex),
    [amountInCrypto, destinationAddress]
  );

  const renderHeaderContentRight = useMemo(
    () => (
      <View style={{ bottom: scale(3) }}>
        <Button>
          <BarcodeScannerIcon />
        </Button>
      </View>
    ),
    []
  );

  const renderHeaderTitle = useMemo(
    () => (
      <View>
        <Text
          align="center"
          fontSize={17}
          color={COLORS.neutral800}
          fontFamily="Inter_600SemiBold"
        >
          {t('account.actions.send')}
        </Text>
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral500}
        >
          {StringUtils.formatAddress(senderAddress, 5, 6)}
        </Text>
      </View>
    ),
    [senderAddress, t]
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

  return (
    <SafeAreaView edges={['top']} style={styles.wrapper}>
      <Header
        bottomBorder
        style={styles.header}
        title={renderHeaderTitle}
        contentRight={renderHeaderContentRight}
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior="padding"
      >
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
                  {t('send.funds.review.transaction')}
                </Text>
              </PrimaryButton>
            </View>
          </View>
          {/* <BottomSheet swiperIconVisible={true} ref={confirmModalRef}>
            <ConfirmTransaction
              from={senderAddress}
              to={destinationAddress}
              etherAmount={parseFloat(amountInCrypto)}
              usdAmount={parseFloat(amountInUSD)}
              currency={selectedToken.symbol}
              estimatedFee={estimatedFee}
              onSendPress={sendTx}
              loading={false}
            />
          </BottomSheet> */}
        </KeyboardDismissingView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
