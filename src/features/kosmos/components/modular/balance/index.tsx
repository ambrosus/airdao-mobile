import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { MarketType, Token } from '@entities/kosmos';
import { NumberUtils } from '@utils';

interface BalanceWithButtonProps {
  quoteToken: Token | undefined;
  market: MarketType | undefined;
  calculateMaximumAvailableAmount: (balance: string) => void;
  tokenBalance: string;
  isFetchingBalance: boolean;
}

export const BalanceWithButton = ({
  quoteToken,
  calculateMaximumAvailableAmount,
  tokenBalance,
  isFetchingBalance
}: BalanceWithButtonProps) => {
  const { t } = useTranslation();

  const onMaxAmountPress = useCallback(() => {
    if (+tokenBalance <= 0) return;

    return calculateMaximumAvailableAmount(tokenBalance);
  }, [calculateMaximumAvailableAmount, tokenBalance]);

  const formattedTokenBalance = NumberUtils.limitDecimalCount(tokenBalance, 2);

  return (
    <Row alignItems="center">
      <Text
        fontSize={14}
        fontFamily="Inter_400Regular"
        color={COLORS.alphaBlack60}
      >
        {t('send.funds.balance')}:
      </Text>
      {isFetchingBalance ? (
        <View style={{ marginLeft: 10 }}>
          <Spinner customSize={15} />
        </View>
      ) : (
        <>
          <Text
            fontSize={14}
            fontFamily="Inter_400Regular"
            color={COLORS.alphaBlack60}
          >{` ${formattedTokenBalance} ${quoteToken?.symbol}`}</Text>
          <Spacer horizontal value={4} />
          <TouchableOpacity onPress={onMaxAmountPress}>
            <Text
              fontSize={14}
              fontFamily="Inter_700Bold"
              color={COLORS.brand500}
            >
              {t('bridge.preview.button.max')}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </Row>
  );
};
