import React from 'react';
import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { NumberUtils } from '@utils/number';
import { COLORS } from '@constants/colors';
import { StringUtils } from '@utils/string';
import moment from 'moment/moment';
import { verticalScale } from '@utils/scaling';
import { useAMBPrice } from '@hooks';
import { TransactionDTO } from '@models/dtos/TransactionDTO';

interface ExplorerTransactionProps {
  transaction: TransactionDTO;
}

const ROW_MARGIN = verticalScale(24);

const JustifiedRow = ({ children }: { children: React.ReactNode }) => (
  <Row alignItems="center" justifyContent="space-between">
    {children}
  </Row>
);

export const ExplorerTransaction = (props: ExplorerTransactionProps) => {
  const { transaction } = props;
  const { data: ambData } = useAMBPrice();

  const ambPrice = ambData ? ambData.priceUSD : -1;
  const totalTransactionAmount = ambData
    ? NumberUtils.formatNumber(transaction.value.ether * ambPrice, 0)
    : -1;

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 25 }}>
      <Text fontFamily="Inter_700Bold" fontSize={20} color={COLORS.nero}>
        Transaction details
      </Text>
      <Spacer value={verticalScale(24)} />
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
          {NumberUtils.formatNumber(transaction.value.ether, 0)} AMB
          {totalTransactionAmount !== -1 && ` ($${totalTransactionAmount})`}
        </Text>
      </JustifiedRow>
      {transaction.from_id && (
        <>
          <Spacer value={ROW_MARGIN} />
          <JustifiedRow>
            <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#646464">
              From
            </Text>
            <Text
              color={COLORS.mainBlue}
              fontFamily="Inter_600SemiBold"
              fontSize={16}
            >
              {StringUtils.formatAddress(transaction.from_id.address, 4, 5)}
            </Text>
          </JustifiedRow>
        </>
      )}
      {transaction.to_id && (
        <>
          <Spacer value={ROW_MARGIN} />
          <JustifiedRow>
            <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#646464">
              To
            </Text>
            <Text
              color={COLORS.mainBlue}
              fontFamily="Inter_600SemiBold"
              fontSize={16}
            >
              {StringUtils.formatAddress(transaction.to_id.address, 4, 5)}
            </Text>
          </JustifiedRow>
        </>
      )}
      <Spacer value={ROW_MARGIN} />
      <JustifiedRow>
        <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#646464">
          TxFee
        </Text>
        <Text color="#222222" fontFamily="Inter_600SemiBold" fontSize={16}>
          {transaction.gasCost.ether}
        </Text>
      </JustifiedRow>
      <Spacer value={ROW_MARGIN} />
      <JustifiedRow>
        <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#646464">
          Time
        </Text>
        <Text fontFamily="Inter_600SemiBold" fontSize={16}>
          {moment(transaction.timestamp * 1000).fromNow()}
        </Text>
      </JustifiedRow>
    </View>
  );
};
