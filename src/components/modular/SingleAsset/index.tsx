import { useMemo } from 'react';
import { View } from 'react-native';
import { ethers } from 'ethers';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useUSDPrice } from '@hooks';
import { Token } from '@models';
import { NumberUtils, StringUtils, StringValidators, scale } from '@utils';
import { TokenLogo, TokenLogoProps } from '../TokenLogo';
import { styles } from './styles';

interface SingleAssetProps {
  token: Token;
  overrideIconVariants?: TokenLogoProps['overrideIconVariants'];
}

export const SingleAsset = ({
  token,
  overrideIconVariants
}: SingleAssetProps): JSX.Element => {
  const { balance, symbol, address, tokenNameFromDatabase } = token;

  const usdPrice = useUSDPrice(+balance.ether, symbol).toFixed(18);

  const tokenUSDBalance = useMemo(() => {
    return `$${NumberUtils.limitDecimalCount(usdPrice, 2)}`;
  }, [usdPrice]);

  const tokenNameOrAddress = useMemo(() => {
    const isAddress = StringValidators.isStringAddress(symbol);

    if (symbol && !isAddress) {
      return symbol;
    }

    return StringUtils.formatAddress(address, 5, 6);
  }, [address, symbol]);

  const tokenSymbol = useMemo(
    () =>
      tokenNameFromDatabase === 'unknown'
        ? token.address
        : tokenNameFromDatabase,
    [token.address, tokenNameFromDatabase]
  );

  return (
    <View style={styles.container}>
      <Row alignItems="center" justifyContent="space-between">
        <Row alignItems="center">
          <TokenLogo
            token={tokenSymbol}
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
              {`${NumberUtils.numberToTransformedLocale(
                ethers.utils.formatEther(balance.wei)
              )} ${symbol || 'tokens'}`}
            </Text>
          </View>
        </Row>
        {!Number.isNaN(+usdPrice) && (
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
