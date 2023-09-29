import React, { useEffect, useReducer, useRef, useState } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
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
import { COLORS } from '@constants/colors';
import {
  useAMBPrice,
  useBalanceOfAddress,
  useEstimatedTransferFee,
  useSelectedWalletHash
} from '@hooks';
import { verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import {
  PrimaryButton,
  Toast,
  ToastPosition,
  ToastType
} from '@components/modular';
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
import { styles } from './styles';
import { WalletUtils } from '@utils/wallet';
import { AirDAOEventDispatcher } from '@lib';

export const SendFunds = () => {
  const { state: sendContextState, reducer: updateSendContext } =
    useSendCryptoContext((v) => v);
  const { to: destinationAddress = '', from: senderAddress = '' } =
    sendContextState;
  const token = AirDAODictTypes.Code.AMB; // TODO use in future to connect different assets/tokens
  const { data: walletHash } = useSelectedWalletHash();
  // const { account, accountLoading } = useMainAccount();
  const { data: balance } = useBalanceOfAddress(senderAddress);
  const { data: ambPriceInfo } = useAMBPrice(); // TODO create a wrapper useTokenPrice hook and pass token name inside to handle different crypto tokens under Ambrosus Networkc
  const ambPrice = ambPriceInfo?.priceUSD || 0;
  const currencyRate = ambPrice;
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();

  // const [destinationAddress, setDestinationAddress] = useState('');
  const [amountInCrypto, setAmountInCrypto] = useState('0');
  const [amountInUSD, setAmountInUSD] = useState('0');
  const [amountShownInUSD, toggleShowInUSD] = useReducer(
    (isInUsd) => !isInUsd,
    false
  );
  const estimatedFee = useEstimatedTransferFee(
    token,
    parseFloat(amountInCrypto),
    senderAddress,
    destinationAddress,
    walletHash
  );

  const confirmModalRef = useRef<BottomSheetRef>(null);

  useEffect(() => {
    updateSendContext({
      type: 'SET_DATA',
      estimatedFee,
      walletHash,
      currency: token,
      currencyConversionRate: currencyRate,
      amount: parseFloat(amountInCrypto)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estimatedFee, walletHash, currencyRate, token, amountInCrypto]);

  const setDestinationAddress = (address: string) => {
    updateSendContext({ type: 'SET_DATA', to: address });
  };

  const useMaxBalance = () => {
    if (balance) {
      setAmountInCrypto(balance.ether.toString());
      setAmountInUSD(
        CurrencyUtils.toUSD(parseFloat(balance.ether), ambPrice).toString()
      );
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
      hideReviewModal();
      navigation.navigate('SendFundsLoading');
      // updateSendContext({ type: 'RESET_DATA' });
      // navigation.replace('HomeScreen');
      AirDAOEventDispatcher.dispatch(AirDAOEventType.FundsSentFromApp, {
        from: senderAddress,
        to: destinationAddress
      });
      Toast.show({
        position: ToastPosition.Top,
        type: ToastType.Success,
        text: t('transaction.in.progress')
      });
      await WalletUtils.sendTx(
        walletHash,
        token,
        senderAddress,
        destinationAddress,
        Number(amountInCrypto),
        balance.ether.toString()
      );
    } catch (error: unknown) {
      // TODO handle
      updateSendContext({
        type: 'SET_DATA',
        loading: false,
        error: error as any
      });
      // Alert.alert('Transfer failed');
    } finally {
      // setSendLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <Header
        title={t('account.actions.send')}
        style={{ shadowColor: COLORS.neutral0 }}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <KeyboardDismissingView style={styles.container}>
          {/* {accountLoading && (
            <View style={styles.loading}>
              <Spinner />
            </View>
          )} */}
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
            <View>
              <Row alignItems="center" justifyContent="space-between">
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
                  cryptoSymbol={token}
                  showInUSD={!amountShownInUSD}
                  cryptoSymbolPlacement="right"
                />
              </Button>
              <Spacer value={verticalScale(16)} />
              <Row alignItems="center" style={{ alignSelf: 'center' }}>
                <Text color={COLORS.neutral400}>
                  {t('send.funds.balance')}: {balance.ether} {token}
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
              disabled={
                Number(amountInCrypto) == 0 ||
                !destinationAddress.match(etherumAddressRegex)
              }
              onPress={showReviewModal}
            >
              <Text
                color={COLORS.neutral0}
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
              currency={token}
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
