import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { MarketType, Token } from '@features/kosmos/types';
import { getBalanceOf } from '@features/kosmos/lib/contracts';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { useBridgeContextData } from '@contexts/Bridge';
import { COLORS } from '@constants/colors';
import { NumberUtils } from '@utils/number';
import { formatEther } from 'ethers/lib/utils';
import { useBalance } from '@features/kosmos/lib/hooks';

interface BalanceWithButtonProps {
  qouteToken: Token | undefined;
  market: MarketType;
}

export const BalanceWithButton = ({
  qouteToken,
  market
}: BalanceWithButtonProps) => {
  const { t } = useTranslation();
  const { setBnBalance, bnBalance, setIsBalanceFetching } =
    useKosmosMarketsContextSelector();
  const { selectedAccount } = useBridgeContextData();
  const [balance, setBalance] = useState('');
  const { calculateMaximumAvailableAmount } = useBalance(market, balance);

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
    if (!bnBalance || +balance <= 0) return;

    return calculateMaximumAvailableAmount();
  }, [balance, bnBalance, calculateMaximumAvailableAmount]);

  return (
    <Row alignItems="center">
      <Text
        fontSize={14}
        fontFamily="Inter_400Regular"
        color={COLORS.alphaBlack60}
      >
        {t('send.funds.balance')}: {balance} {qouteToken?.symbol}
      </Text>
      <Spacer horizontal value={4} />
      <TouchableOpacity onPress={onMaxAmountPress}>
        <Text fontSize={14} fontFamily="Inter_700Bold" color={COLORS.brand500}>
          {t('bridge.preview.button.max')}
        </Text>
      </TouchableOpacity>
    </Row>
  );
};
