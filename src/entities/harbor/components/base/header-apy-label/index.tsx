import React from 'react';
import { Row, Spacer, Text } from '@components/base';
import { APYHeaderIcon } from '@components/svg/icons/v2/harbor';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';
import { styles } from './styles';

interface StakeHeaderIconModel {
  apr: string | number;
}

export const HeaderAPYLabel = ({ apr }: StakeHeaderIconModel) => {
  return (
    <Row justifyContent="center" alignItems="center" style={styles.main}>
      <APYHeaderIcon />
      <Spacer horizontal value={scale(5)} />
      <Text
        fontFamily="Inter_500Medium"
        fontSize={14}
        color={COLORS.success300}
      >
        APY {apr} %
      </Text>
      <Spacer horizontal value={scale(8)} />
    </Row>
  );
};
