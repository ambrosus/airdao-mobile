import React, { useCallback, useMemo } from 'react';
import { ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { TokenInfo } from '@features/dex-swap-interface/types';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { FIELD } from '@features/dex-swap-interface/types/fields';
import { useDEXSwapContextSelector } from '@features/dex-swap-interface/model/dex-swap.context';
import { Checkmark } from '@components/svg/icons';

interface BottomSheetCurrencyItemProps {
  currency: ListRenderItemInfo<TokenInfo>['item'];
  type: keyof typeof FIELD;
}

export const BottomSheetCurrencyItem = ({
  currency,
  type
}: BottomSheetCurrencyItemProps) => {
  const { selectedTokens, onChangeSelectedTokens } =
    useDEXSwapContextSelector();

  const onChangeSelectedToken = useCallback(() => {
    onChangeSelectedTokens(type, currency);
  }, [currency, onChangeSelectedTokens, type]);

  const isSelectedSameToken = useMemo(() => {
    return currency.symbol === selectedTokens[type]?.symbol;
  }, [currency.symbol, selectedTokens, type]);

  const disabledSelectedOppositeToken = useMemo(() => {
    return (
      selectedTokens[type === FIELD.INPUT ? FIELD.OUTPUT : FIELD.INPUT]
        ?.symbol === currency.symbol
    );
  }, [selectedTokens, type, currency.symbol]);

  const SAMBSupportedTokenLogo =
    currency.symbol === 'SAMB' ? 'AMB' : currency.symbol;

  const combineDisabledStates = useMemo(() => {
    return disabledSelectedOppositeToken || isSelectedSameToken;
  }, [disabledSelectedOppositeToken, isSelectedSameToken]);

  const opacity = useMemo(() => {
    return {
      opacity: combineDisabledStates ? 0.5 : 1
    };
  }, [combineDisabledStates]);

  return (
    <TouchableOpacity
      disabled={combineDisabledStates}
      onPress={onChangeSelectedToken}
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
            {currency.symbol}
          </Text>
          <Spacer horizontal value={6} />
          <Text
            fontSize={16}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral400}
          >
            {currency.name}
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
