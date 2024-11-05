import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from 'react';
import {
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  View
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import {
  Button,
  Input,
  InputRef,
  KeyboardDismissingView,
  Row,
  Spacer,
  Text
} from '@components/base';
import { TokenPicker } from '@components/templates';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import {
  useCurrencyRate,
  useEstimatedTransferFee,
  useTokensAndTransactions,
  useUSDPrice,
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
import { CurrencyUtils } from '@utils/currency';
import { etherumAddressRegex } from '@constants/regex';
import { useSendCryptoContext } from '@contexts';
import {
  AddressInput,
  ConfirmTransaction,
  ShowInUSD,
  UseMax
} from './components';
import { AirDAOEventDispatcher } from '@lib';
import { Token } from '@models';
import { TransactionUtils } from '@utils/transaction';
import { DeviceUtils } from '@utils/device';
import { NumberUtils } from '@utils/number';
import { styles } from './styles';
import { isAndroid } from '@utils/isPlatform';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics/sendFirebaseEvent';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';
import { BarcodeScannerIcon } from '@components/svg/icons/v2';
import {
  useAMBEntity,
  useAmountChangeHandler
} from '@features/send-funds/lib/hooks';

export const SendFunds = () => {
  const { state: sendContextState, reducer: updateSendContext } =
    useSendCryptoContext((v) => v);
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<RouteProp<HomeParamsList, 'SendFunds'>>();
  const tokenFromNavigationParams = route.params?.token;

  const {
    to: destinationAddress = '',
    from: senderAddress = '',
    transactionId
  } = sendContextState;

  const transactionIdRef = useRef('');
  const amountInputRef = useRef<InputRef>(null);

  const { wallet: account } = useWallet();
  const walletHash = account?.wallet.id ?? '';

  const _AMBEntity = useAMBEntity(senderAddress);

  useEffect(() => {
    if (transactionId) transactionIdRef.current = transactionId;
  }, [transactionId]);

  const [amountInputFocused, setAmountInputFocused] = useState(false);

  const {
    data: { tokens }
  } = useTokensAndTransactions(senderAddress || '', 1, 20, !!senderAddress);

  const [selectedToken, setSelectedToken] = useState<Token>(
    tokens.find(
      (token) => token.address === tokenFromNavigationParams?.address
    ) || _AMBEntity
  );
  const currencyRate = useCurrencyRate(
    selectedToken.symbol as CryptoCurrencyCode
  );
  const isPositiveRate = currencyRate > 0;
  const getTokenBalance = () => {
    const currentTokenBalance = tokens.find(
      (token) => token.address === selectedToken.address
    )?.balance.formattedBalance;
    return currentTokenBalance
      ? +NumberUtils.limitDecimalCount(currentTokenBalance, 3)
      : 0;
  };
  const balanceInCrypto =
    selectedToken.name === _AMBEntity.name
      ? +NumberUtils.limitDecimalCount(_AMBEntity.balance.formattedBalance, 3)
      : getTokenBalance();
  // convert crypto balance to usd
  const balanceInUSD = useUSDPrice(
    balanceInCrypto,
    selectedToken.symbol as CryptoCurrencyCode
  );

  const [amountShownInUSD, toggleShowInUSD] = useReducer(
    (isInUsd) => !isInUsd,
    false
  );

  const showUsdAmountOnlyPositiveRate = amountShownInUSD && isPositiveRate;

  const {
    amountInCrypto,
    amountInUSD,
    setAmountInCrypto,
    setAmountInUSD,
    onChangeAmountHandle
  } = useAmountChangeHandler({
    showUsdAmountOnlyPositiveRate,
    currencyRate
  });

  // calculate estimated fee
  const estimatedFee = useEstimatedTransferFee(
    selectedToken,
    parseFloat(amountInCrypto),
    senderAddress,
    destinationAddress
  );
  const confirmModalRef = useRef<BottomSheetRef>(null);

  const selectToken = (newToken: Token) => {
    setSelectedToken(newToken);
  };

  useEffect(() => {
    updateSendContext({
      type: 'SET_DATA',
      estimatedFee,
      currency: selectedToken.symbol as CryptoCurrencyCode,
      amount: parseFloat(amountInCrypto)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estimatedFee, selectedToken, amountInCrypto]);

  useEffect(() => {
    onChangeAmountValue(amountShownInUSD ? amountInUSD : amountInCrypto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyRate]);

  const setDestinationAddress = (address: string) => {
    updateSendContext({ type: 'SET_DATA', to: address });
  };

  const useMaxBalance = () => {
    if (balanceInCrypto) {
      let maxSendableBalance: number = balanceInCrypto;
      if (selectedToken.name === 'AirDAO') {
        maxSendableBalance = balanceInCrypto - 0.0005;
      }

      setAmountInCrypto(
        NumberUtils.limitDecimalCount(maxSendableBalance.toString(), 3)
      );
      setAmountInUSD(
        NumberUtils.limitDecimalCount(
          CurrencyUtils.toUSD(balanceInCrypto, currencyRate).toString(),
          3
        )
      );
    }
  };

  const onChangeAmountValue = useCallback(
    (newValue: string) => onChangeAmountHandle(newValue),
    [onChangeAmountHandle]
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

  const balanceAmount = (() => {
    const usdSymbol = showUsdAmountOnlyPositiveRate ? ' $' : ' ';
    const amount = showUsdAmountOnlyPositiveRate
      ? balanceInUSD.toFixed(3)
      : balanceInCrypto.toFixed(3);
    const cryptoSymbol = showUsdAmountOnlyPositiveRate
      ? ''
      : selectedToken.symbol;
    return `${usdSymbol}${amount} ${cryptoSymbol}`;
  })();

  const reviewButtonDisabled =
    Number(amountInCrypto) === 0 ||
    !destinationAddress.match(etherumAddressRegex);

  const onToggleAmountInputState = useCallback(
    () => setAmountInputFocused((p) => !p),
    []
  );

  const onAmountInputPress = useCallback(() => {
    Keyboard.dismiss();

    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => amountInputRef.current?.focus(), 200);
    });
  }, []);

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

  return (
    <SafeAreaView edges={['top']} style={styles.wrapper}>
      <Header
        bottomBorder
        title={renderHeaderTitle}
        contentRight={renderHeaderContentRight}
        style={styles.header}
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
              !destinationAddress.match(etherumAddressRegex) && (
                <View style={styles.addressError}>
                  <Text fontSize={12} color={COLORS.error400}>
                    {t('send.funds.invalid.address')}
                  </Text>
                </View>
              )}
          </View>

          <View style={styles.innerContainer}>
            <View style={styles.wrapper}>
              <Row alignItems="center" justifyContent="space-between">
                <TokenPicker
                  tokens={[_AMBEntity].concat(tokens)}
                  selectedToken={selectedToken}
                  onSelectToken={selectToken}
                />
                <View />
                <Button onPress={useMaxBalance}>
                  <UseMax />
                </Button>
              </Row>
              <Spacer value={verticalScale(32)} />
              <View>
                <Input
                  ref={amountInputRef}
                  onFocus={onToggleAmountInputState}
                  onBlur={onToggleAmountInputState}
                  type="number"
                  value={
                    showUsdAmountOnlyPositiveRate ? amountInUSD : amountInCrypto
                  }
                  onChangeValue={onChangeAmountValue}
                  style={styles.input}
                  maxLength={9}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={COLORS.neutral300}
                  multiline={DeviceUtils.isAndroid} // without it cursor moves to end when input is deleted, Android only
                />
                {!amountInputFocused && isAndroid && (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={onAmountInputPress}
                    style={styles.inputButton}
                  />
                )}
              </View>
              <Spacer value={verticalScale(16)} />
              {isPositiveRate && (
                <Button onPress={toggleShowInUSD}>
                  <ShowInUSD
                    usdAmount={Number(amountInUSD)}
                    cryptoAmount={Number(amountInCrypto)}
                    cryptoSymbol={selectedToken.symbol}
                    showInUSD={!amountShownInUSD}
                    cryptoSymbolPlacement="right"
                  />
                </Button>
              )}
              <Spacer value={verticalScale(16)} />
              <Row alignItems="center" style={{ alignSelf: 'center' }}>
                <Text color={COLORS.neutral400}>
                  {t('send.funds.balance')}: {balanceAmount}
                </Text>
              </Row>
            </View>
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
          <BottomSheet swiperIconVisible={true} ref={confirmModalRef}>
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
          </BottomSheet>
        </KeyboardDismissingView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
