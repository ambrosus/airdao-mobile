import React from 'react';
import { Row, Spacer, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { StakedBalanceIcon } from '@components/svg/icons/v2/harbor';
import { NumberUtils, scale } from '@utils';
import { styles } from './styles';

interface StakedBalanceInfoModel {
  stakedValue: string;
  coin: string;
  title: string;
}

export const StakedBalanceInfo = ({
  stakedValue,
  coin,
  title
}: StakedBalanceInfoModel) => (
  <Row justifyContent="space-between" style={styles.container}>
    <Row alignItems="center">
      <StakedBalanceIcon />
      <Spacer horizontal value={scale(8)} />
      <Text style={styles.textStyle}>{title}</Text>
    </Row>
    <Row alignItems="center">
      <TokenLogo token={coin} />
      <Spacer horizontal value={scale(8)} />
      <Text style={styles.textStyle}>
        {NumberUtils.limitDecimalCount(stakedValue, 2)} {coin}
      </Text>
    </Row>
  </Row>
);
