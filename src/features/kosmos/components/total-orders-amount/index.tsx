import { useMemo } from 'react';
import { View } from 'react-native';
import { upperCase } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { styles } from './styles';
import {
  totalBondedReducer,
  totalClaimableReducer,
  TxType,
  useToken
} from '../../entries';

interface TotalOrdersAmountProps {
  transactions: TxType[];
}

export const TotalOrdersAmount = ({ transactions }: TotalOrdersAmountProps) => {
  const { t } = useTranslation();
  const { extractTokenCb } = useToken();

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
          color={COLORS.neutral500}
        >
          {upperCase(t('kosmos.orders.total.bonded'))}
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
          color={COLORS.neutral500}
        >
          {upperCase(t('kosmos.orders.claimable'))}
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
