import React, { useCallback, useMemo } from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Row, Spacer, Text } from '@components/base';
import { useSwapContextSelector } from '@features/swap/context';
import { SelectedTokensKeys } from '@features/swap/types';
import { scale } from '@utils/scaling';
import { TokenLogo } from '@components/modular';
import { ChevronDownIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { useSwapBottomSheetHandler } from '@features/swap/lib/hooks';
import { SwapStringUtils } from '@features/swap/utils';

interface TokenSelectorProps {
  readonly type: SelectedTokensKeys;
}

export const TokenSelector = ({ type }: TokenSelectorProps) => {
  const { t } = useTranslation();
  const { selectedTokens } = useSwapContextSelector();
  const { onShowBottomSheetByKey } = useSwapBottomSheetHandler();

  const isSelectedToken = useMemo(() => {
    return !!selectedTokens[type];
  }, [selectedTokens, type]);

  const currencySelectorStyle: StyleProp<ViewStyle> = useMemo(() => {
    return [
      styles.currencySelector,
      { paddingHorizontal: scale(isSelectedToken ? 6 : 8) }
    ];
  }, [isSelectedToken]);

  const tokenSymbolTypographyStyle: StyleProp<TextStyle> = useMemo(() => {
    return {
      paddingRight: scale(selectedTokens[type]?.symbol === 'AMB' ? 8 : 0)
    };
  }, [selectedTokens, type]);

  const SAMBSupportedTokenLogo = SwapStringUtils.extendedLogoVariants(
    selectedTokens[type]?.symbol ?? ''
  );

  const onToggleSelectTokenModal = useCallback(() => {
    onShowBottomSheetByKey(type);
  }, [onShowBottomSheetByKey, type]);

  return (
    <TouchableOpacity onPress={onToggleSelectTokenModal}>
      <View style={currencySelectorStyle}>
        <Row alignItems="center">
          {isSelectedToken && (
            <>
              <TokenLogo scale={0.75} token={SAMBSupportedTokenLogo ?? ''} />
              <Spacer horizontal value={scale(4)} />
            </>
          )}
          <Text
            fontSize={14}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral900}
            style={tokenSymbolTypographyStyle}
          >
            {isSelectedToken
              ? selectedTokens[type]?.symbol
              : t('swap.select.asset')}
          </Text>
        </Row>
        <Spacer horizontal value={scale(4)} />
        <ChevronDownIcon color={COLORS.neutral900} />
      </View>
    </TouchableOpacity>
  );
};
