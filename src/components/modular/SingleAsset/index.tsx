import React, { useMemo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Row, Spacer, Text } from '@components/base';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { useUSDPrice } from '@hooks';
import { Token } from '@models';
import { TokenLogo, TokenLogoProps } from '../TokenLogo';
import { NumberUtils } from '@utils/number';
import { StringUtils } from '@utils/string';
import { StringValidators } from '@utils';

interface SingleAssetProps {
  token: Token;
  overrideIconVariants?: TokenLogoProps['overrideIconVariants'];
}

export const SingleAsset = ({
  token,
  overrideIconVariants
}: SingleAssetProps): JSX.Element => {
  const { balance, symbol, address, tokenNameFromDatabase } = token;

  const usdPrice = useUSDPrice(balance.ether, symbol);

  const tokenUSDBalance = useMemo(() => {
    return `$${NumberUtils.numberToTransformedLocale(usdPrice.toString())}`;
  }, [usdPrice]);

  const tokenBalance = balance.formattedBalance;

  const tokenNameOrAddress = useMemo(() => {
    const isAddress = StringValidators.isStringAddress(symbol);

    if (symbol && !isAddress) {
      return symbol;
    }

    return StringUtils.formatAddress(address, 5, 6);
  }, [address, symbol]);

  return (
    <View style={styles.container}>
      <Row alignItems="center" justifyContent="space-between">
        <Row alignItems="center">
          <TokenLogo
            token={tokenNameFromDatabase}
            overrideIconVariants={overrideIconVariants}
          />
          <Spacer horizontal value={scale(8)} />
          <View>
            <Text
              fontFamily="Inter_500Medium"
              fontSize={16}
              color={COLORS.neutral800}
            >
              {tokenNameOrAddress}
            </Text>
            <Spacer value={scale(2)} />
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={13}
              color={COLORS.neutral400}
            >
              {NumberUtils.numberToTransformedLocale(tokenBalance)}{' '}
              {symbol || 'tokens'}
            </Text>
          </View>
        </Row>
        {!Number.isNaN(usdPrice) && (
          <Text
            fontFamily="Inter_400Regular"
            fontSize={16}
            color={COLORS.neutral800}
          >
            {tokenUSDBalance}
          </Text>
        )}
      </Row>
    </View>
  );
};
