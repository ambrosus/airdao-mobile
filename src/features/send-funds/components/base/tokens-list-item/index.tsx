import React, { useCallback, useMemo } from 'react';
import { Row, Spacer, Text } from '@components/base';
import { Token } from '@models';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { styles } from './styles';
import { SwapStringUtils } from '@features/swap/utils';
import { NumberUtils } from '@utils/number';
import { StringValidators } from '@utils';
import { StringUtils } from '@utils/string';
import { useUSDPrice } from '@hooks';
import { CryptoCurrencyCode } from '@appTypes';

interface TokensListItemProps {
  token: Token;
  selectedToken: Token;
  onSelectToken: (token: Token) => void;
}

export const TokensListItem = ({
  token,
  selectedToken,
  onSelectToken
}: TokensListItemProps) => {
  const usdPrice = useUSDPrice(
    token.balance.ether,
    token.symbol as CryptoCurrencyCode
  );

  const isSelectedSameToken = useMemo(() => {
    return token.address === selectedToken.address;
  }, [selectedToken.address, token.address]);

  const containerStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      ...styles.container,
      backgroundColor: isSelectedSameToken ? COLORS.neutral50 : 'transparent'
    };
  }, [isSelectedSameToken]);

  const SAMBSupportedTokenLogo = SwapStringUtils.extendedLogoVariants(
    token.symbol
  );

  const onChangeSelectedTokenPress = useCallback(
    () => onSelectToken(token),
    [onSelectToken, token]
  );

  const tokenNameOrAddress = useMemo(() => {
    const { name, address } = token;
    const isAddress = StringValidators.isStringAddress(name);
    return StringUtils.formatAddress(isAddress ? name : name || address, 5, 6);
  }, [token]);

  return (
    <TouchableOpacity
      style={containerStyle}
      disabled={isSelectedSameToken}
      onPress={onChangeSelectedTokenPress}
    >
      <Row alignItems="center" justifyContent="space-between">
        <Row alignItems="center">
          <TokenLogo scale={1} token={SAMBSupportedTokenLogo ?? ''} />
          <Spacer horizontal value={6} />
          <View>
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral800}
            >
              {token.symbol}
            </Text>

            <Spacer horizontal value={6} />
            <Text
              fontSize={16}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral400}
            >
              {tokenNameOrAddress}
            </Text>
          </View>
        </Row>

        <View style={styles.balancesColumn}>
          <Text
            fontSize={16}
            fontFamily="Inter_400Regular"
            color={COLORS.neutral800}
          >
            {NumberUtils.limitDecimalCount(token.balance.formattedBalance, 2)}
          </Text>
          <Text
            fontSize={15}
            fontFamily="Inter_400Regular"
            color={COLORS.neutral500}
          >
            ${NumberUtils.numberToTransformedLocale(usdPrice)}
          </Text>
        </View>
      </Row>
    </TouchableOpacity>
  );
};
