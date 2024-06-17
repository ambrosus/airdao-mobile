import React from 'react';
import { styles } from './styles';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD } from '@features/swap/types';
import { SwapStringUtils } from '@features/swap/utils';
import { TokenLogo } from '@components/modular';
import { Row, Spacer, Text } from '@components/base';
import { NumberUtils } from '@utils/number';

interface BottomSheetReviewTokenItemProps {
  type: keyof typeof FIELD;
}

export const BottomSheetReviewTokenItem = ({
  type
}: BottomSheetReviewTokenItemProps) => {
  const { selectedTokens, selectedTokensAmount } = useSwapContextSelector();

  const token = SwapStringUtils.extendedLogoVariants(
    selectedTokens[type]?.symbol ?? ''
  );

  return (
    <Row alignItems="center" width={131.5} style={styles.container}>
      <TokenLogo token={token} scale={0.65} />
      <Spacer horizontal value={4} />
      <Text>
        {NumberUtils.limitDecimalCount(selectedTokensAmount[type], 2)}{' '}
        {selectedTokens[type]?.symbol}
      </Text>
    </Row>
  );
};
