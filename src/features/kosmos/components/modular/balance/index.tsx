import React, { useCallback, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { MarketType, Token } from '@features/kosmos/types';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { COLORS } from '@constants/colors';
import { useBalance } from '@features/kosmos/lib/hooks';
import { useWallet } from '@hooks';

interface BalanceWithButtonProps {
  qouteToken: Token | undefined;
  market: MarketType;
}

export const BalanceWithButton = ({
  qouteToken,
  market
}: BalanceWithButtonProps) => {
  const { wallet } = useWallet();

  const { t } = useTranslation();
  const { bnBalance, fetchBondBalance, bondBalance } =
    useKosmosMarketsContextSelector();
  const { calculateMaximumAvailableAmount } = useBalance(market, bondBalance);

  const onMaxAmountPress = useCallback(() => {
    if (+bondBalance <= 0) return;

    return calculateMaximumAvailableAmount();
  }, [bondBalance, calculateMaximumAvailableAmount]);

  useEffect(() => {
    if (!qouteToken || bondBalance !== '' || bnBalance) return;

    fetchBondBalance(qouteToken).then();
  }, [bnBalance, bondBalance, fetchBondBalance, qouteToken, wallet.address]);

  return (
    <Row alignItems="center">
      <Text
        fontSize={14}
        fontFamily="Inter_400Regular"
        color={COLORS.alphaBlack60}
      >
        {t('send.funds.balance')}: {bondBalance} {qouteToken?.symbol}
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
