import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { Token } from '@features/kosmos/types';
import { getBalanceOf } from '@features/kosmos/lib/contracts';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { useBridgeContextData } from '@contexts/Bridge';
import { COLORS } from '@constants/colors';
import { NumberUtils } from '@utils/number';
import { formatEther } from 'ethers/lib/utils';

interface BalanceWithButtonProps {
  qouteToken: Token | undefined;
}

export const BalanceWithButton = ({ qouteToken }: BalanceWithButtonProps) => {
  const { onChangeAmountToBuy, setBnBalance, setIsBalanceFetching } =
    useKosmosMarketsContextSelector();
  const { selectedAccount } = useBridgeContextData();
  const [balance, setBalance] = useState('');

  useEffect(() => {
    (async () => {
      try {
        if (qouteToken) {
          setIsBalanceFetching(true);
          const bnBalance = await getBalanceOf({
            ownerAddress: selectedAccount?.address ?? '',
            token: qouteToken
          });

          setBalance(
            NumberUtils.limitDecimalCount(formatEther(bnBalance?._hex), 2)
          );
          setBnBalance(bnBalance);
        }
      } finally {
        setIsBalanceFetching(false);
      }
    })();
  }, [
    qouteToken,
    selectedAccount?.address,
    setBnBalance,
    setIsBalanceFetching
  ]);

  const onMaxAmountPress = useCallback(() => {
    if (+balance > 0.0) onChangeAmountToBuy(balance);
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
      <TouchableOpacity onPress={onMaxAmountPress}>
        <Text fontSize={14} fontFamily="Inter_700Bold" color={COLORS.brand500}>
          Max
        </Text>
      </TouchableOpacity>
    </Row>
  );
};
