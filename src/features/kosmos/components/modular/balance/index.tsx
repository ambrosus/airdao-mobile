import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { MarketType, Token } from '@features/kosmos/types';
import { COLORS } from '@constants/colors';
import { useBalance } from '@features/kosmos/lib/hooks';

interface BalanceWithButtonProps {
  quoteToken: Token | undefined;
  market: MarketType | undefined;
}

export const BalanceWithButton = ({
  quoteToken,
  market
}: BalanceWithButtonProps) => {
  const { t } = useTranslation();

  const { calculateMaximumAvailableAmount, tokenBalance } = useBalance(market);

  const onMaxAmountPress = useCallback(() => {
    if (+tokenBalance <= 0) return;

    return calculateMaximumAvailableAmount(tokenBalance);
  }, [calculateMaximumAvailableAmount, tokenBalance]);

  return (
    <Row alignItems="center">
      <Text
        fontSize={14}
        fontFamily="Inter_400Regular"
        color={COLORS.alphaBlack60}
      >
        {t('send.funds.balance')}: {tokenBalance} {quoteToken?.symbol}
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
