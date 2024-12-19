import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';
import { StakeHeaderIcon } from '../StakedHeaderIcon';

export const HarborTitle = ({ harborAPR }: { harborAPR: string }) => {
  const { t } = useTranslation();
  return (
    <Row alignItems="center">
      <Text
        color={COLORS.neutral900}
        fontSize={scale(18)}
        fontFamily="Inter_700Bold"
      >
        {t('harbor.stakeAMB.header')}
      </Text>
      <Spacer horizontal value={scale(8)} />
      <StakeHeaderIcon apr={harborAPR} />
    </Row>
  );
};
