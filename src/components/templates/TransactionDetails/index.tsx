import React, { useRef } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import { SharePortfolio } from '../BottomSheetSharePortfolio';
import { Button, Row, Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { ShareIcon } from '@components/svg/icons';
import { Transaction } from '@models/Transaction';
import { NumberUtils } from '@utils/number';
import { StringUtils } from '@utils/string';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { useAMBPrice } from '@hooks';
import { styles } from './styles';

interface TransactionDetailsProps {
  transaction: Transaction;
  isShareable?: boolean;
  onPressAddress?: (address: string) => void;
}

const ROW_MARGIN = verticalScale(24);

const JustifiedRow = ({ children }: { children: React.ReactNode }) => (
  <Row alignItems="center" justifyContent="space-between">
    {children}
  </Row>
);

export const TransactionDetails = (
  props: TransactionDetailsProps
): JSX.Element => {
  const { transaction, isShareable = true, onPressAddress } = props;
  const shareTransactionModal = useRef<BottomSheetRef>(null);
  const { data: ambData } = useAMBPrice();
  const ambPrice = ambData ? ambData.priceUSD : -1;
  let totalTransactionAmount;

  if (ambData) {
    const result = transaction.amount * ambPrice;
    totalTransactionAmount =
      result < 1000
        ? NumberUtils.formatNumber(result, 2)
        : NumberUtils.formatNumber(result, 0);
  } else {
    totalTransactionAmount = -1;
  }

  const showShareTransaction = () => {
    shareTransactionModal.current?.show();
  };
  if (!transaction) return <></>;
  const addressesArePressable = typeof onPressAddress === 'function';

  const onPressSendingAddress = () => {
    if (transaction.from && typeof onPressAddress === 'function') {
      onPressAddress(transaction.from.address);
    }
  };

  const onPressReceivingAddress = () => {
    if (transaction.to && typeof onPressAddress === 'function') {
      onPressAddress(transaction.to.address);
    }
  };

  return (
    <View testID="Transaction_Details">
      <JustifiedRow>
        <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#646464">
          Method
        </Text>
        <Text fontFamily="Inter_600SemiBold" fontSize={16}>
          {transaction.type}
        </Text>
      </JustifiedRow>
      <Spacer value={ROW_MARGIN} />
      <JustifiedRow>
        <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#646464">
          Amount
        </Text>
        <Text fontFamily="Inter_600SemiBold" fontSize={16}>
          {NumberUtils.formatNumber(transaction.amount, 0)} AMB
          {totalTransactionAmount !== -1 && ` ($${totalTransactionAmount})`}
        </Text>
      </JustifiedRow>
      {transaction.from && (
        <>
          <Spacer value={ROW_MARGIN} />
          <JustifiedRow>
            <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#646464">
              From
            </Text>
            <Button
              disabled={!addressesArePressable}
              onPress={onPressSendingAddress}
            >
              <Text
                color={COLORS.mainBlue}
                fontFamily="Inter_600SemiBold"
                fontSize={16}
              >
                {StringUtils.formatAddress(transaction.from.address, 4, 5)}
              </Text>
            </Button>
          </JustifiedRow>
        </>
      )}
      {transaction.to && (
        <>
          <Spacer value={ROW_MARGIN} />
          <JustifiedRow>
            <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#646464">
              To
            </Text>
            <Button
              disabled={!addressesArePressable}
              onPress={onPressReceivingAddress}
            >
              <Text
                color={COLORS.mainBlue}
                fontFamily="Inter_600SemiBold"
                fontSize={16}
              >
                {StringUtils.formatAddress(transaction.to.address, 4, 5)}
              </Text>
            </Button>
          </JustifiedRow>
        </>
      )}
      <Spacer value={ROW_MARGIN} />
      <JustifiedRow>
        <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#646464">
          TxFee
        </Text>
        <Text color="#222222" fontFamily="Inter_600SemiBold" fontSize={16}>
          {transaction.fee}
        </Text>
      </JustifiedRow>
      <Spacer value={ROW_MARGIN} />
      <JustifiedRow>
        <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#646464">
          Time
        </Text>
        <Text fontFamily="Inter_600SemiBold" fontSize={16}>
          {moment(transaction.timestamp).fromNow()}
        </Text>
      </JustifiedRow>
      {isShareable && (
        <>
          <Spacer value={ROW_MARGIN} />
          <Button
            type="circular"
            style={styles.shareBtn}
            onPress={showShareTransaction}
            testID="Show_Share_Transaction_Button"
          >
            <Row alignItems="center">
              <ShareIcon color="#000000" />
              <Spacer value={scale(3.5)} horizontal />
              <Text>Share transaction</Text>
            </Row>
          </Button>
        </>
      )}

      <SharePortfolio
        ref={shareTransactionModal}
        balance={NumberUtils.formatNumber(transaction.amount, 0)}
        currency="AMB"
        currencyPosition="right"
        txFee={transaction.fee}
        title="Transaction"
        bottomSheetTitle="Share Transaction"
        timestamp={transaction.timestamp}
      />
    </View>
  );
};
