import React, { useEffect, useReducer, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import {
  Button,
  Input,
  KeyboardDismissingView,
  Row,
  Spacer,
  Text
} from '@components/base';
import { TokenPicker } from '@components/templates';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import {
  useAMBPrice,
  useBalanceOfAddress,
  useEstimatedTransferFee,
  useSelectedWalletHash,
  useTokensAndTransactions
} from '@hooks';
import { verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { AirDAOEventType, HomeNavigationProp } from '@appTypes';
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
import { styles } from './styles';

export const SendFunds = () => {
  const { state: sendContextState, reducer: updateSendContext } =
    useSendCryptoContext((v) => v);
  const { to: destinationAddress = '', from: senderAddress = '' } =
    sendContextState;
  // const selectedToken = AirDAODictTypes.Code.AMB; // TODO use in future to connect different assets/tokens
  const { data: walletHash } = useSelectedWalletHash();
  // const { account, accountLoading } = useMainAccount();
  const { data: ambBalance } = useBalanceOfAddress(senderAddress);
  const { data: ambPriceInfo } = useAMBPrice(); // TODO create a wrapper useTokenPrice hook and pass selectedToken name inside to handle different crypto tokens under Ambrosus Networkc
  const ambPrice = ambPriceInfo?.priceUSD || 0;
  const currencyRate = ambPrice;
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const {
    data: { tokens }
  } = useTokensAndTransactions(senderAddress || '', 1, 20, !!senderAddress);
  const defaultAMBToken: Token = new Token({
    name: 'AMB',
    address: senderAddress || '',
    balance: { wei: '', ether: Number(ambBalance.ether) || 0 },
    symbol: AirDAODictTypes.Code.AMB
  });

  // const [destinationAddress, setDestinationAddress] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token>(defaultAMBToken);
  const [amountInCrypto, setAmountInCrypto] = useState('');
  const [amountInUSD, setAmountInUSD] = useState('');
  const [amountShownInUSD, toggleShowInUSD] = useReducer(
    (isInUsd) => !isInUsd,
    false
  );
  const estimatedFee = useEstimatedTransferFee(
    selectedToken,
    parseFloat(amountInCrypto),
    senderAddress,
    destinationAddress,
    walletHash
  );
  const confirmModalRef = useRef<BottomSheetRef>(null);
  const balance =
    selectedToken.name === defaultAMBToken.name
      ? defaultAMBToken.balance.ether
      : tokens.find((t) => t.name === selectedToken.name)?.balance.ether || 0;

  const selectToken = (newToken: Token) => {
    setSelectedToken(newToken);
    setAmountInCrypto('0');
    setAmountInUSD('0');
  };

  useEffect(() => {
    updateSendContext({
      type: 'SET_DATA',
      estimatedFee,
      walletHash,
      currency: selectedToken.symbol,
      currencyConversionRate: currencyRate,
      amount: parseFloat(amountInCrypto)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estimatedFee, walletHash, currencyRate, selectedToken, amountInCrypto]);

  const setDestinationAddress = (address: string) => {
    updateSendContext({ type: 'SET_DATA', to: address });
  };

  const useMaxBalance = () => {
    if (balance) {
      setAmountInCrypto(balance.toString());
      setAmountInUSD(CurrencyUtils.toUSD(balance, ambPrice).toString());
    }
  };

  const onChangeAmountValue = (newValue: string) => {
    if (!newValue) {
      setAmountInCrypto('');
      setAmountInUSD('');
      return;
    }
    if (amountShownInUSD) {
      setAmountInUSD(StringUtils.formatNumberInput(newValue));
      const newUsdAmount =
        parseFloat(StringUtils.formatNumberInput(newValue)) || 0;
      setAmountInCrypto(
        CurrencyUtils.toCrypto(newUsdAmount, ambPrice).toString()
      );
    } else {
      setAmountInCrypto(StringUtils.formatNumberInput(newValue));
      const newCryptoAmount =
        parseFloat(StringUtils.formatNumberInput(newValue)) || 0;
      setAmountInUSD(CurrencyUtils.toUSD(newCryptoAmount, ambPrice).toString());
    }
  };

  const showReviewModal = () => {
    confirmModalRef.current?.show();
  };

  const hideReviewModal = () => {
    confirmModalRef.current?.dismiss();
  };

  const sendTx = async () => {
    hideReviewModal();
    try {
      updateSendContext({ type: 'SET_DATA', loading: true });
      navigation.replace('SendFundsStatus');
      AirDAOEventDispatcher.dispatch(AirDAOEventType.FundsSentFromApp, {
        from: senderAddress,
        to: destinationAddress
      });
      await TransactionUtils.sendTx(
        walletHash,
        destinationAddress,
        Number(amountInCrypto),
        selectedToken
      );
      updateSendContext({ type: 'SET_DATA', loading: false });
    } catch (error: unknown) {
      updateSendContext({
        type: 'SET_DATA',
        loading: false,
        error: error as any
      });
    }
  };

  const reviewButtonDisabled =
    Number(amountInCrypto) == 0 ||
    !destinationAddress.match(etherumAddressRegex);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <Header
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
        style={{ flex: 1 }}
        behavior="padding"
        enabled={Platform.OS === 'ios'}
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
              <Input
                type="number"
                value={amountShownInUSD ? amountInUSD : amountInCrypto}
                onChangeValue={onChangeAmountValue}
                style={styles.input}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={COLORS.neutral300}
              />
              <Spacer value={verticalScale(16)} />
              <Button onPress={toggleShowInUSD}>
                <ShowInUSD
                  usdAmount={Number(amountInUSD)}
                  cryptoAmount={Number(amountInCrypto)}
                  cryptoSymbol={selectedToken.symbol}
                  showInUSD={!amountShownInUSD}
                  cryptoSymbolPlacement="right"
                />
              </Button>
              <Spacer value={verticalScale(16)} />
              <Row alignItems="center" style={{ alignSelf: 'center' }}>
                <Text color={COLORS.neutral400}>
                  {t('send.funds.balance')}: {balance} {selectedToken.symbol}
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
