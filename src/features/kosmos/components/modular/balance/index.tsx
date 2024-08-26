import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ethers } from 'ethers';
import { useWallet } from '@hooks';
import { Row, Spacer, Text } from '@components/base';
import { MarketType, Token } from '@features/kosmos/types';
import { getBalanceOf } from '@features/kosmos/lib/contracts';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { COLORS } from '@constants/colors';
import { NumberUtils } from '@utils/number';
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
  const { wallet } = useWallet();
  const [balance, setBalance] = useState('');
  const { calculateMaximumAvailableAmount } = useBalance(market, balance);

  useEffect(() => {
    if (!qouteToken || balance !== '' || bnBalance) return;

    const fetchBalance = async () => {
      try {
        setIsBalanceFetching(true);
        const bnBalance = await getBalanceOf({
          ownerAddress: wallet?.address ?? '',
          token: qouteToken
        });

        const formattedBalance = NumberUtils.limitDecimalCount(
          ethers.utils.formatEther(bnBalance?._hex),
          2
        );

        if (formattedBalance !== balance) {
          setBalance(formattedBalance);
          setBnBalance(bnBalance);
        }
      } finally {
        setIsBalanceFetching(false);
      }
    };

    fetchBalance();
  }, [
    balance,
    bnBalance,
    qouteToken,
    setBnBalance,
    setIsBalanceFetching,
    wallet?.address
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
