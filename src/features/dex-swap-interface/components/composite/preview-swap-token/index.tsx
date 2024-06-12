import React, { useMemo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Spacer, Text } from '@components/base';
import { FIELD } from '@features/dex-swap-interface/types';
import { TokenLogo } from '@components/modular';
import { useDEXSwapContextSelector } from '@features/dex-swap-interface/model';
import { COLORS } from '@constants/colors';
import { useUSDPrice } from '@hooks';
import { CryptoCurrencyCode } from '@appTypes';
import { NumberUtils } from '@utils/number';
import { verticalScale } from '@utils/scaling';

interface PreviewSwapTokenProps {
  type: keyof typeof FIELD;
}

export const PreviewSwapToken = ({ type }: PreviewSwapTokenProps) => {
  const { selectedTokens, selectedTokensAmount } = useDEXSwapContextSelector();

  const token = useMemo(() => {
    return selectedTokens[type];
  }, [selectedTokens, type]);

  const amount = useMemo(() => {
    return selectedTokensAmount[type];
  }, [selectedTokensAmount, type]);

  const USDPrice = useUSDPrice(+amount, token?.symbol as CryptoCurrencyCode);

  return (
    <View style={styles.container}>
      <TokenLogo scale={1.5} token={token?.symbol ?? ''} />
      <Spacer value={verticalScale(8)} />
      <Text fontSize={16} color={COLORS.neutral800}>
        {NumberUtils.limitDecimalCount(amount, 2)} {token?.symbol}
      </Text>

      <Text
        fontSize={14}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral400}
      >
        ${NumberUtils.limitDecimalCount(USDPrice, 2)}
      </Text>
    </View>
  );
};
