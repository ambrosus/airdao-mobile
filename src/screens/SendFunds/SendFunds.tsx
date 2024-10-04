import React, {
  useCallback,
  useEffect,
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
  useBalanceOfAddress,
  useCurrencyRate,
  useEstimatedTransferFee,
  useTokensAndTransactions,
  useUSDPrice
} from '@hooks';
import { verticalScale } from '@utils/scaling';
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
  EstimatedFee,
  ShowInUSD,
  UseMax
} from './components';
import { AirDAOEventDispatcher } from '@lib';
import { Token } from '@models';
import { TransactionUtils } from '@utils/transaction';
import { DeviceUtils } from '@utils/device';
import { useAccountByAddress } from '@hooks/database';
import { NumberUtils } from '@utils/number';
import { styles } from './styles';
import { TokenUtils } from '@utils/token';
import { isAndroid } from '@utils/isPlatform';
import { formatUnits } from 'ethers/lib/utils';
import { AMB_DECIMALS } from '@constants/variables';

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
  const transactionIdRef = useRef(transactionId);
  const amountInputRef = useRef<InputRef>(null);
  transactionIdRef.current = transactionId;
  const { data: selectedAccount } = useAccountByAddress(senderAddress);
  const walletHash = selectedAccount?.wallet.id || '';

  const [amountInputFocused, setAmountInputFocused] = useState(false);

  const {
    data: { tokens }
  } = useTokensAndTransactions(senderAddress || '', 1, 20, !!senderAddress);
  const { data: tokenBalance } = useBalanceOfAddress(senderAddress);

  // Define default amb token
  const defaultAMBToken: Token = new Token(
    {
      name: 'AirDAO',
      address: senderAddress || '',
      isNativeCoin: true,
      balance: {
        wei: tokenBalance.wei,
        ether: Number(tokenBalance.ether) || 0,
        formattedBalance: formatUnits(tokenBalance.wei, AMB_DECIMALS)
      },
      symbol: CryptoCurrencyCode.AMB,
      decimals: AMB_DECIMALS,
      tokenNameFromDatabase: 'AirDAO'
    },
    TokenUtils
  );

  const [selectedToken, setSelectedToken] = useState<Token>(
    tokens.find(
      (token) => token.address === tokenFromNavigationParams?.address
    ) || defaultAMBToken
  );
  const currencyRate = useCurrencyRate(selectedToken.symbol);
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
    selectedToken.name === defaultAMBToken.name
      ? +NumberUtils.limitDecimalCount(
          defaultAMBToken.balance.formattedBalance,
          3
        )
      : getTokenBalance();
  // convert crypto balance to usd
  const balanceInUSD = useUSDPrice(balanceInCrypto, selectedToken.symbol);

  const [amountInCrypto, setAmountInCrypto] = useState('');
  const [amountInUSD, setAmountInUSD] = useState('');
  const [amountShownInUSD, toggleShowInUSD] = useReducer(
    (isInUsd) => !isInUsd,
    false
  );

  const showUsdAmountOnlyPositiveRate = amountShownInUSD && isPositiveRate;

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
      currency: selectedToken.symbol,
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

  const onChangeAmountValue = (newValue: string) => {
    if (!newValue) {
      setAmountInCrypto('');
      setAmountInUSD('');
      return;
    }
    let finalValue = StringUtils.formatNumberInput(newValue);
    finalValue = NumberUtils.limitDecimalCount(finalValue, 3);
    if (showUsdAmountOnlyPositiveRate) {
      setAmountInUSD(finalValue);
      const newUsdAmount = parseFloat(finalValue) || 0;
      setAmountInCrypto(
        CurrencyUtils.toCrypto(newUsdAmount, currencyRate).toFixed(3)
      );
    } else {
      setAmountInCrypto(finalValue);
      const newCryptoAmount = parseFloat(finalValue) || 0;
      setAmountInUSD(
        CurrencyUtils.toUSD(newCryptoAmount, currencyRate).toFixed(3)
      );
    }
  };

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
        navigation.replace('SendFundsStatus');
        AirDAOEventDispatcher.dispatch(AirDAOEventType.FundsSentFromApp, {
          from: senderAddress,
          to: destinationAddress
        });
        await TransactionUtils.sendTx(
          walletHash,
          senderAddress,
          destinationAddress,
          Number(amountInCrypto),
          selectedToken
        );
        if (transactionIdRef.current === txId) {
          updateSendContext({ type: 'SET_DATA', loading: false });
        }
      } catch (error: unknown) {
        if (transactionIdRef.current === txId) {
          updateSendContext({
            type: 'SET_DATA',
            loading: false,
            error: error as any
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

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <Header
        bottomBorder
        title={
          <View>
            <Text
              align="center"
              fontSize={18}
              color={COLORS.neutral800}
              fontFamily="Inter_700Bold"
            >
              {t('account.actions.send')}
            </Text>
            <Row alignItems="center">
              <Text fontSize={14} color={COLORS.neutral300}>
                {t('common.transaction.from')}{' '}
              </Text>
              <Text color={COLORS.neutral700} fontSize={14}>
                {StringUtils.formatAddress(senderAddress, 5, 6)}
              </Text>
            </Row>
          </View>
        }
        style={{ shadowColor: COLORS.neutral0 }}
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
          <View style={styles.divider} />
          <View
            style={[
              styles.horizontalPadding,
              {
                flex: 1,
                justifyContent: 'space-between'
              }
            ]}
          >
            <View style={{ flex: 1 }}>
              <Row alignItems="center" justifyContent="space-between">
                <TokenPicker
                  tokens={[defaultAMBToken].concat(tokens)}
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
              <Spacer value={verticalScale(32)} />
              {estimatedFee > 0 && (
                <View style={{ alignSelf: 'center' }}>
                  <EstimatedFee
                    fee={estimatedFee}
                    currency="AMB"
                    currencyPlacement="right"
                  />
                </View>
              )}
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
