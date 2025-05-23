import { useCallback, useMemo } from 'react';
import {
  ListRenderItemInfo,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { ethers } from 'ethers';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useSwapContextSelector } from '@features/swap/context';
import {
  useSwapFieldsHandler,
  useSwapSelectTokens
} from '@features/swap/lib/hooks';
import { FIELD, SelectedTokensKeys, SwapToken } from '@features/swap/types';
import { SwapStringUtils } from '@features/swap/utils';
import { NumberUtils, getTokenNameFromDatabase } from '@utils';
import { styles } from './styles';

interface BottomSheetTokenItemProps {
  token: ListRenderItemInfo<SwapToken>['item'];
  type: SelectedTokensKeys;
  bnBalance: ethers.BigNumber;
}

export const BottomSheetTokenItem = ({
  token,
  type,
  bnBalance
}: BottomSheetTokenItemProps) => {
  const { selectedTokens, setIsExactIn, balancesLoading } =
    useSwapContextSelector();
  const { onSelectToken, onReverseSelectedTokens } = useSwapSelectTokens();
  const { updateReceivedTokensOutput } = useSwapFieldsHandler();

  const isSelectedSameToken = useMemo(() => {
    return token.symbol === selectedTokens[type]?.symbol;
  }, [selectedTokens, token.symbol, type]);

  const isSelectedReversedToken = useMemo(() => {
    const oppositeKey = type === FIELD.TOKEN_A ? FIELD.TOKEN_B : FIELD.TOKEN_A;

    return selectedTokens[oppositeKey]?.address === token.address;
  }, [selectedTokens, token.address, type]);

  const onChangeSelectedTokenPress = useCallback(() => {
    const { TOKEN_A, TOKEN_B } = selectedTokens;

    if (isSelectedReversedToken) {
      setIsExactIn((prevState) => !prevState);
      onReverseSelectedTokens();

      if (TOKEN_A && TOKEN_B) {
        setTimeout(async () => {
          await updateReceivedTokensOutput();
        });
      }
    } else {
      onSelectToken(type, token);
    }
  }, [
    selectedTokens,
    isSelectedReversedToken,
    setIsExactIn,
    onReverseSelectedTokens,
    updateReceivedTokensOutput,
    onSelectToken,
    type,
    token
  ]);

  const tokenLogoHref = useMemo(
    () =>
      getTokenNameFromDatabase(token.address) !== 'unknown'
        ? token.symbol
        : token.address,
    [token.address, token.symbol]
  );

  const SAMBSupportedTokenLogo =
    SwapStringUtils.extendedLogoVariants(tokenLogoHref);

  const balance = useMemo(() => {
    if (bnBalance) {
      return NumberUtils.numberToTransformedLocale(
        ethers.utils.formatEther(bnBalance?._hex)
      );
    }

    return '';
  }, [bnBalance]);

  const combineDisabledStates = useMemo(() => {
    return isSelectedReversedToken;
  }, [isSelectedReversedToken]);

  const containerStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      ...styles.container,
      borderWidth: isSelectedSameToken ? 0.5 : 0,
      borderColor: '#D8DAE0',
      backgroundColor: isSelectedSameToken ? COLORS.neutral50 : 'transparent',
      opacity: combineDisabledStates ? 0.5 : 1
    };
  }, [combineDisabledStates, isSelectedSameToken]);

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
          </View>
        </Row>

        {balancesLoading ? (
          <Spinner />
        ) : (
          <Text
            fontSize={16}
            fontFamily="Inter_400Regular"
            color={COLORS.neutral800}
          >
            {balance}
          </Text>
        )}
      </Row>
    </TouchableOpacity>
  );
};
