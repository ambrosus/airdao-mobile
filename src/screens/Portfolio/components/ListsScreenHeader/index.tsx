import React from 'react';
import { View } from 'react-native';
import { Spacer, Text } from '@components/base';
import { styles } from '@screens/Portfolio/components/ListsScreenHeader/styles';
import { NumberUtils } from '@utils/number';
import { PercentChange } from '@components/composite';
import { useAMBPrice } from '@hooks';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

type Props = {
  totalAmount: number;
};
export const ListsScreenHeader = ({ totalAmount }: Props) => {
  const { data } = useAMBPrice();

  return (
    <View style={styles.headerContainer}>
      <Spacer value={verticalScale(32)} />
      <Text style={styles.balanceSubtitle}>Total list balance</Text>
      <Spacer value={verticalScale(12)} />
      <Text style={styles.balanceCount}>
        ${NumberUtils.formatNumber(totalAmount, 0)}
      </Text>
      <Spacer value={verticalScale(12)} />
      <View style={styles.balanceStats}>
        <Text
          style={[
            styles.balanceTokens,
            { fontFamily: 'Inter_500Medium', fontSize: 12 }
          ]}
        >
          20,000 AMB
        </Text>
        <PercentChange change={data?.percentChange24H || 0} />
        <Spacer horizontal value={scale(4)} />
        <Text
          fontFamily="Inter_500Medium"
          fontSize={12}
          color={COLORS.graphiteGrey}
        >
          24HR
        </Text>
      </View>
    </View>
  );
};
