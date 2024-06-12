import React, { useMemo } from 'react';
import { Button, Row, Spacer, Text } from '@components/base';
import { NumberUtils } from '@utils/number';
import { useSwapContextSelector } from '@features/swap/context';
import { useUSDPrice } from '@hooks';
import { formatEther } from 'ethers/lib/utils';
import { useSwapBalance } from '@features/swap/lib/hooks';
import { SelectedTokensKeys } from '@features/swap/types';
import { scale } from '@utils/scaling';

interface BalanceProps {
  type: SelectedTokensKeys;
}

export const Balance = ({ type }: BalanceProps) => {
  const { selectedTokensAmount } = useSwapContextSelector();

  const normalizedTokenBalance = useMemo(() => {
    return 0;
  }, [type]);

  //   const USDTokenPrice = useUSDPrice(
  //     Number(NumberUtils.limitDecimalCount(formatEther(bnBalance?.hex), 2))
  //   );

  return (
    <Row alignItems="center" justifyContent="space-between">
      {/* <Text>~${NumberUtils.limitDecimalCount(USDTokenPrice, 2)}</Text> */}

      <Row alignItems="center">
        <Text>{normalizedTokenBalance}</Text>

        <Spacer horizontal value={scale(16)} />

        <Button>
          <Text
            fontSize={14}
            fontFamily="Inter_600SemiBold"
            color="#3668DD"
          ></Text>
        </Button>
      </Row>
    </Row>
  );
};
