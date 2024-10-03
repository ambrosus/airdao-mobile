import React, { useMemo, useRef } from 'react';
import { Linking, View } from 'react-native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Button, Row, Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { Transaction, TransactionTokenInfo } from '@models/Transaction';
import { NumberUtils } from '@utils/number';
import { StringUtils } from '@utils/string';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { useAMBPrice } from '@hooks';
import { SharePortfolio } from '../BottomSheetSharePortfolio';
import { styles } from './styles';
import { TokenLogo } from '@components/modular';

interface TransactionDetailsProps {
  transaction: Transaction;
  isShareable?: boolean;
  onPressAddress?: (address: string) => void;
  onViewOnExplorerPress?: () => void;
  transactionTokenInfo: TransactionTokenInfo;
}

const ROW_MARGIN: number = verticalScale(24);

const JustifiedRow = ({ children }: { children: React.ReactNode }) => (
  <Row alignItems="center" justifyContent="space-between">
    {children}
  </Row>
);

export const TransactionDetails = (
  props: TransactionDetailsProps
): JSX.Element => {
  const {
    transaction,
    onPressAddress,
    onViewOnExplorerPress,
    transactionTokenInfo
  } = props;
  const isTransfer = transaction.type === 'Transfer';
  const isContractCall = transaction.type.includes('ContractCall');
  const isTokenTransfer = transaction.type === 'TokenTransfer';

  const amountTokenLogo = useMemo(() => {
    switch (true) {
      case isTransfer:
        return 'AirDAO';
      case isTokenTransfer:
        return transaction?.token?.name;
      case isContractCall:
        return transaction?.value?.symbol;
      default:
        return 'unknown';
    }
  }, [
    isContractCall,
    isTokenTransfer,
    isTransfer,
    transaction?.token?.name,
    transaction?.value?.symbol
  ]);

  const shareTransactionModal = useRef<BottomSheetRef>(null);
  const { data: ambData } = useAMBPrice();
  const { t } = useTranslation();
  const isSuccessTransaction = transaction.status === 'SUCCESS';

  const currentStatus = t(`common.transaction.status.${transaction.status}`);

  // status to render
  const transactionStatus = useMemo(() => {
    switch (transaction.status) {
      case 'FAIL':
      case 'SUCCESS':
        return currentStatus;
      default:
        return transaction.status;
    }
  }, [currentStatus, transaction.status]);

  const transactionStatusStyle = useMemo(() => {
    const fieldName = isSuccessTransaction ? 'success' : 'error';

    return {
      pointBackgroundColor: COLORS[`${fieldName}600`],
      backgroundColor: COLORS[`${fieldName}100`],
      textColor: COLORS[`${fieldName}500`]
    };
  }, [isSuccessTransaction]);

  const ambPrice = ambData ? ambData.priceUSD : -1;
  let totalTransactionAmount;
  if (ambData) {
    const result = transaction.amount * ambPrice;
    totalTransactionAmount =
      result < 1000
        ? NumberUtils.limitDecimalCount(result, 2)
        : NumberUtils.limitDecimalCount(result, 0);
  } else {
    totalTransactionAmount = -1;
  }

  // TODO temporarily hide share buttons
  // const showShareTransaction = () => {
  //   shareTransactionModal.current?.show();
  // };

  if (!transaction) return <></>;
  const addressesArePressable = typeof onPressAddress === 'function';

  const onPressSendingAddress = () => {
    if (transaction.from && typeof onPressAddress === 'function') {
      onPressAddress(transaction.from);
    }
  };

  const onPressReceivingAddress = () => {
    if (transaction.to && typeof onPressAddress === 'function') {
      onPressAddress(transaction.to);
    }
  };

  return (
    <View testID="Transaction_Details">
      <JustifiedRow>
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={COLORS.neutral300}
        >
          {t('common.date')}
        </Text>
        <Text
          fontFamily="Inter_500Medium"
          fontSize={16}
          color={COLORS.neutral800}
        >
          {moment(transaction.timestamp).format('MM/DD/YYYY hh:mm')}
        </Text>
      </JustifiedRow>
      <Spacer value={ROW_MARGIN} />
      <JustifiedRow>
        <Text
          color={COLORS.neutral300}
          fontSize={16}
          fontFamily="Inter_600SemiBold"
        >
          {t('common.status')}
        </Text>
        <Row
          alignItems="center"
          style={{
            ...styles.status,
            backgroundColor: transactionStatusStyle.backgroundColor
          }}
        >
          <View
            style={{
              ...styles.statusPoint,
              backgroundColor: transactionStatusStyle.pointBackgroundColor
            }}
          />
          <Spacer horizontal value={scale(4)} />
          <Text
            fontSize={14}
            fontFamily="Inter_500Medium"
            color={transactionStatusStyle.textColor}
          >
            {transactionStatus}
          </Text>
        </Row>
      </JustifiedRow>
      {transaction.from && (
        <>
          <Spacer value={ROW_MARGIN} />
          <JustifiedRow>
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={16}
              color={COLORS.neutral300}
            >
              {t('common.transaction.from')}
            </Text>
            <Button
              disabled={!addressesArePressable}
              onPress={onPressSendingAddress}
            >
              <Text
                style={{
                  textDecorationLine: 'underline'
                }}
                color={COLORS.neutral800}
                fontFamily="Inter_600SemiBold"
                fontSize={16}
              >
                {StringUtils.formatAddress(transaction.from, 4, 5)}
              </Text>
            </Button>
          </JustifiedRow>
        </>
      )}
      {transaction.to && (
        <>
          <Spacer value={ROW_MARGIN} />
          <JustifiedRow>
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={16}
              color={COLORS.neutral300}
            >
              {t('common.transaction.to')}
            </Text>
            <Button
              disabled={!addressesArePressable}
              onPress={onPressReceivingAddress}
            >
              <Text
                color={COLORS.neutral800}
                fontFamily="Inter_600SemiBold"
                fontSize={16}
                style={{
                  textDecorationLine: 'underline'
                }}
              >
                {StringUtils.formatAddress(transaction.to, 4, 5)}
              </Text>
            </Button>
          </JustifiedRow>
        </>
      )}
      <Spacer value={ROW_MARGIN} />
      <JustifiedRow>
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={COLORS.neutral300}
        >
          {t('common.transaction.amount')}
        </Text>
        <Row alignItems="center">
          <TokenLogo token={amountTokenLogo} scale={0.5} />
          <Spacer value={scale(4)} horizontal />
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.neutral800}
          >
            {NumberUtils.limitDecimalCount(
              transactionTokenInfo.cryptoAmount,
              2
            )}{' '}
            {transaction.symbol}
            <Text
              fontFamily="Inter_500Medium"
              fontSize={14}
              color={COLORS.neutral400}
            >
              {totalTransactionAmount !== -1 && ` $${totalTransactionAmount}`}
            </Text>
          </Text>
        </Row>
      </JustifiedRow>
      <Spacer value={ROW_MARGIN} />
      <JustifiedRow>
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={COLORS.neutral300}
        >
          {t('common.estimated.fee')}
        </Text>
        <Row alignItems="center">
          <TokenLogo token="AirDAO" scale={0.5} />
          <Spacer value={scale(4)} horizontal />
          <Text
            color={COLORS.neutral700}
            fontFamily="Inter_600SemiBold"
            fontSize={14}
          >
            {NumberUtils.limitDecimalCount(transaction.fee.toString(), 6)} AMB
          </Text>
        </Row>
      </JustifiedRow>
      <Spacer value={ROW_MARGIN} />
      <Button
        type="circular"
        style={{ backgroundColor: COLORS.alphaBlack5 }}
        onPress={() => {
          if (typeof onViewOnExplorerPress === 'function') {
            onViewOnExplorerPress();
          }
          Linking.openURL(`https://airdao.io/explorer/tx/${transaction.hash}/`);
        }}
      >
        <Text
          style={{ marginVertical: verticalScale(12) }}
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={COLORS.neutral800}
        >
          {t('transaction.modal.buttons.explorer')}
        </Text>
      </Button>
      <Spacer value={verticalScale(16)} />
      {/*TODO temporarily hide share buttons*/}
      {/*<Button*/}
      {/*  type="circular"*/}
      {/*  style={{ backgroundColor: COLORS.alphaBlack5 }}*/}
      {/*  onPress={showShareTransaction}*/}
      {/*>*/}
      {/*  <Text*/}
      {/*    style={{ marginVertical: verticalScale(12) }}*/}
      {/*    fontFamily="Inter_600SemiBold"*/}
      {/*    fontSize={16}*/}
      {/*    color={COLORS.neutral800}*/}
      {/*  >*/}
      {/*    {t('transaction.modal.buttons.share')}*/}
      {/*  </Text>*/}
      {/*</Button>*/}

      <SharePortfolio
        ref={shareTransactionModal}
        balance={NumberUtils.limitDecimalCount(transaction.amount, 2)}
        currency="AMB"
        currencyPosition="right"
        txFee={transaction.fee}
        title={t('common.transaction')}
        bottomSheetTitle={t('common.share.transaction')}
        timestamp={transaction.timestamp}
      />
    </View>
  );
};
