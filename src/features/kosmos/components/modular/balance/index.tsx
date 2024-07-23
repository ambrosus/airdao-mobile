import React, { useCallback, useEffect, useState } from 'react';
import { Row, Spacer, Text } from '@components/base';
import { Token } from '@features/kosmos/types';
import { getBalanceOf } from '@features/kosmos/lib/contracts';
import { useBridgeContextData } from '@contexts/Bridge';
import { formatEther } from 'ethers/lib/utils';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { NumberUtils } from '@utils/number';
import { COLORS } from '@constants/colors';

interface BalanceWithButtonProps {
  qouteToken: Token | undefined;
}

export const BalanceWithButton = ({ qouteToken }: BalanceWithButtonProps) => {
  const { onChangeAmountToBuy } = useKosmosMarketsContextSelector();
  const { selectedAccount } = useBridgeContextData();
  const [balance, setBalance] = useState('');

  useEffect(() => {
    (async () => {
      if (qouteToken) {
        const bnBalance = await getBalanceOf({
          ownerAddress: selectedAccount?.address ?? '',
          token: qouteToken
        });

        setBalance(
          NumberUtils.limitDecimalCount(formatEther(bnBalance?._hex), 2)
        );
      }
    })();
  }, [qouteToken, selectedAccount?.address]);

  const onMaxAmountPress = useCallback(() => {
    onChangeAmountToBuy(balance);
  }, [balance, onChangeAmountToBuy]);

  return (
    <Row alignItems="center">
      <Text
        fontSize={14}
        fontFamily="Inter_400Regular"
        color={COLORS.alphaBlack60}
      >
        Balance: {balance} {qouteToken?.symbol}
      </Text>
      <Spacer horizontal value={4} />
      <Text
        fontSize={14}
        fontFamily="Inter_700Bold"
        color={COLORS.brand500}
        onPress={onMaxAmountPress}
      >
        Max
      </Text>
    </Row>
  );
};
