import { useCallback, useMemo } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { CryptoCurrencyCode } from '@appTypes';
import { Row, Spacer, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useWalletStore } from '@entities/wallet';
import { useUSDPrice } from '@hooks';
import { Token } from '@models';
import {
  StringValidators,
  wrapTokenIcon,
  NumberUtils,
  StringUtils,
  getTokenNameFromDatabase
} from '@utils';
import { styles } from './styles';

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
  const { wallet } = useWalletStore();
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

  const SAMBSupportedTokenLogo = wrapTokenIcon(token);

  const onChangeSelectedTokenPress = useCallback(
    () => onSelectToken(token),
    [onSelectToken, token]
  );

  const tokenSymbolOrAddress = useMemo(() => {
    const { symbol, address } = token;
    const isAddress = StringValidators.isStringAddress(symbol);

    if (symbol && !isAddress) {
      return symbol;
    }

    return StringUtils.formatAddress(address, 5, 6);
  }, [token]);

  const isNativeToken = useMemo(
    () => token.address === wallet?.address,
    [token.address, wallet?.address]
  );

  const tokenLogoHref = useMemo(
    () =>
      isNativeToken || getTokenNameFromDatabase(token.address) !== 'unknown'
        ? SAMBSupportedTokenLogo
        : token.address,
    [SAMBSupportedTokenLogo, isNativeToken, token.address]
  );

  return (
    <TouchableOpacity
      style={containerStyle}
      disabled={isSelectedSameToken}
      onPress={onChangeSelectedTokenPress}
    >
      <Row alignItems="center" justifyContent="space-between">
        <Row alignItems="center">
          <TokenLogo scale={1} token={tokenLogoHref ?? ''} />
          <Spacer horizontal value={6} />
          <View>
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral800}
            >
              {tokenSymbolOrAddress}
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
          {!Number.isNaN(usdPrice) && (
            <Text
              fontSize={15}
              fontFamily="Inter_400Regular"
              color={COLORS.neutral500}
            >
              ${NumberUtils.numberToTransformedLocale(usdPrice)}
            </Text>
          )}
        </View>
      </Row>
    </TouchableOpacity>
  );
};
