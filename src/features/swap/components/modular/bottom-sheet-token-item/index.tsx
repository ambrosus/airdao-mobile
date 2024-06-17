import React, { useCallback, useMemo } from 'react';
import { ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { Checkmark } from '@components/svg/icons';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD, SelectedTokensKeys, SwapToken } from '@features/swap/types';
import {
  useSwapFieldsHandler,
  useSwapSelectTokens
} from '@features/swap/lib/hooks';
import { SwapStringUtils } from '@features/swap/utils';

interface BottomSheetTokenItemProps {
  token: ListRenderItemInfo<SwapToken>['item'];
  type: SelectedTokensKeys;
}

export const BottomSheetTokenItem = ({
  token,
  type
}: BottomSheetTokenItemProps) => {
  const { selectedTokens, setIsExactIn } = useSwapContextSelector();
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
        }, 250);
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

  const SAMBSupportedTokenLogo = SwapStringUtils.extendedLogoVariants(
    token.symbol
  );

  const combineDisabledStates = useMemo(() => {
    return isSelectedSameToken || isSelectedReversedToken;
  }, [isSelectedReversedToken, isSelectedSameToken]);

  const opacity = useMemo(() => {
    return {
      opacity: combineDisabledStates ? 0.5 : 1
    };
  }, [combineDisabledStates]);

  return (
    <TouchableOpacity
      disabled={isSelectedSameToken}
      onPress={onChangeSelectedTokenPress}
    >
      <Row alignItems="center" justifyContent="space-between">
        <Row style={opacity} alignItems="center">
          <TokenLogo scale={0.65} token={SAMBSupportedTokenLogo ?? ''} />
          <Spacer horizontal value={6} />
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
            {token.name}
          </Text>
        </Row>
        {isSelectedSameToken && (
          <Checkmark
            size={24}
            fillColor={COLORS.success500}
            iconColor={COLORS.neutral0}
          />
        )}
      </Row>
    </TouchableOpacity>
  );
};
