import React, { useMemo } from 'react';
import { View } from 'react-native';
import { BigNumber, utils } from 'ethers';
import { upperCase } from 'lodash';
import { styles } from './styles';
import { TxType } from '@features/kosmos/types';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useExtractToken } from '@features/kosmos/lib/hooks';

interface TotalOrdersAmountProps {
  transactions: TxType[];
}

export const TotalOrdersAmount = ({ transactions }: TotalOrdersAmountProps) => {
  const { extractTokenCb } = useExtractToken();

  const totalBonded = useMemo(() => {
    const total = transactions.reduce((acc, curr) => {
      const payoutToken = extractTokenCb(curr.payoutToken);
      const payoutBn = BigNumber.from(curr.payoutAmount);
      const payout = utils.formatUnits(payoutBn, payoutToken?.decimals);
      const payoutPrice = +payout * (payoutToken?.price || 0);

      if (!curr.isClaimed) {
        return acc + payoutPrice;
      }
      return acc;
    }, 0);

    return Math.ceil(total * 100) / 100;
  }, [extractTokenCb, transactions]);

  const totalClaimable = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      const payoutToken = extractTokenCb(curr.payoutToken);
      const payoutBn = BigNumber.from(curr.payoutAmount);
      const payout = utils.formatUnits(payoutBn, payoutToken?.decimals);
      const payoutPrice = +payout * (payoutToken?.price || 0);

      const vestingEndsDate =
        curr.vestingType === 'Fixed-expiry'
          ? +curr.vesting
          : +curr.vesting + curr.date;

      const isVestingPass = vestingEndsDate * 1000 < new Date().getTime();

      if (isVestingPass && !curr.isClaimed) {
        return acc + payoutPrice;
      }
      return acc;
    }, 0);
  }, [extractTokenCb, transactions]);

  return (
    <View style={styles.container}>
      <Row alignItems="center" justifyContent="space-between">
        <Text
          fontSize={12}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral600}
          style={styles.keyTypography}
        >
          {upperCase('total value bonded')}
        </Text>
        <Text
          fontSize={16}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral800}
        >
          {totalBonded.toFixed(2)}$
        </Text>
      </Row>
      <Row alignItems="center" justifyContent="space-between">
        <Text
          fontSize={12}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral600}
          style={styles.keyTypography}
        >
          {upperCase('claimable')}
        </Text>
        <Text
          fontSize={16}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral800}
        >
          {totalClaimable.toFixed(2)}$
        </Text>
      </Row>
    </View>
  );
};
