import React, { useMemo } from 'react';
import { View } from 'react-native';
import { upperCase } from 'lodash';
import { styles } from './styles';
import { TxType } from '@features/kosmos/types';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useExtractToken } from '@features/kosmos/lib/hooks';
import {
  totalBondedReducer,
  totalClaimableReducer
} from '@features/kosmos/utils';

interface TotalOrdersAmountProps {
  transactions: TxType[];
}

export const TotalOrdersAmount = ({ transactions }: TotalOrdersAmountProps) => {
  const { extractTokenCb } = useExtractToken();

  const totalBonded = useMemo(() => {
    return totalBondedReducer(transactions, extractTokenCb);
  }, [extractTokenCb, transactions]);

  const totalClaimable = useMemo(() => {
    return totalClaimableReducer(transactions, extractTokenCb);
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
