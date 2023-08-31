import React, { useReducer, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, View } from 'react-native';
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
  Spinner,
  Text
} from '@components/base';
import { COLORS } from '@constants/colors';
import {
  useAMBPrice,
  useEstimatedTransferFee,
  useMainAccount,
  useSelectedWalletHash
} from '@hooks';
import { verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { PrimaryButton, Toast, ToastPosition } from '@components/modular';
import { HomeNavigationProp } from '@appTypes';
import { CurrencyUtils } from '@utils/currency';
import { etherumAddressRegex } from '@constants/regex';
import { WalletUtils } from '@utils/wallet';
import {
  AddressInput,
  ConfirmTransaction,
  EstimatedFee,
  ShowInUSD,
  UseMax
} from './components';
import { styles } from './styles';

export const SendFunds = () => {
  const token = AirDAODictTypes.Code.AMB; // TODO use in future to connect different assets/tokens
  const walletHash = useSelectedWalletHash();
  const { account, accountLoading } = useMainAccount();
  const { data: ambPriceInfo } = useAMBPrice(); // TODO create a wrapper useTokenPrice hook and pass token name inside to handle different crypto tokens under Ambrosus Network
  const ambPrice = ambPriceInfo?.priceUSD || 0;
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();

  const [destinationAddress, setDestinationAddress] = useState('');
  const [amountInCrypto, setAmountInCrypto] = useState('0');
  const [amountInUSD, setAmountInUSD] = useState('0');
  const [amountShownInUSD, toggleShowInUSD] = useReducer(
    (isInUsd) => !isInUsd,
    false
  );
  const estimatedFee = useEstimatedTransferFee(
    token,
    parseFloat(amountInCrypto),
    account?.address || '',
    destinationAddress,
    walletHash
  );

  const confirmModalRef = useRef<BottomSheetRef>(null);

  const useMaxBalance = () => {
    if (account) {
      setAmountInCrypto(account.ambBalance.toString());
      setAmountInUSD(
        CurrencyUtils.toUSD(account.ambBalance, ambPrice).toString()
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
    if (account) {
      try {
        await WalletUtils.sendTx(
          walletHash,
          token,
          account.address,
          destinationAddress,
          Number(amountInCrypto),
          account.ambBalance.toString()
        );
        hideReviewModal();
        navigation.replace('HomeScreen');
        Toast.show({
          type: ToastPosition.Top,
          title: t('transaction.in.progress'),
          message: ''
        });
      } catch (error) {
        Alert.alert('Transfer failed');
      }
    }
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <Header
        title={t('account.actions.send')}
        style={{ shadowColor: COLORS.white }}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <KeyboardDismissingView style={styles.container}>
          {accountLoading && (
            <View style={styles.loading}>
              <Spinner />
            </View>
          )}
          {account && (
            <>
              <View style={styles.horizontalPadding}>
                <AddressInput
                  address={destinationAddress}
                  onAddressChange={setDestinationAddress}
                />
                {destinationAddress.length > 0 &&
                  !destinationAddress.match(etherumAddressRegex) && (
                    <View style={styles.addressError}>
                      <Text fontSize={12} color={COLORS.crimsonRed}>
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
                      {t('send.funds.balance')}: {account.ambBalance} {token}
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
                    color={COLORS.white}
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
                  from={account.address}
                  to={destinationAddress}
                  etherAmount={parseFloat(amountInCrypto)}
                  usdAmount={parseFloat(amountInUSD)}
                  currency={token}
                  estimatedFee={estimatedFee}
                  onSendPress={sendTx}
                />
              </BottomSheet>
            </>
          )}
        </KeyboardDismissingView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
