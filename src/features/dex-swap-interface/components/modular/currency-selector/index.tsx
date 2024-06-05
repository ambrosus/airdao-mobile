import React, { useCallback, useMemo } from 'react';
import {
  Keyboard,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { styles } from './styles';
import { Text, Spacer, Row } from '@components/base';
import { ChevronDownIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { useDEXSwapContextSelector } from '@features/dex-swap-interface/model/dex-swap.context';
import { FIELD } from '@features/dex-swap-interface/types/fields';
import { BottomSheetCurrenciesList } from '@features/dex-swap-interface/components/templates';
import { TokenLogo } from '@components/modular';

interface CurrencySelectorProps {
  type: keyof typeof FIELD;
}

export const CurrencySelector = ({ type }: CurrencySelectorProps) => {
  const {
    onDismissBottomSheets,
    bottomSheetRefInput,
    bottomSheetRefOutput,
    selectedTokens
  } = useDEXSwapContextSelector();

  const isSelectedToken = !!selectedTokens[type];

  const toggleCurrenciesList = useCallback(() => {
    Keyboard.dismiss();
    setTimeout(() => {
      onDismissBottomSheets(type);
    }, 500);
  }, [onDismissBottomSheets, type]);

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

  const SAMBSupportedTokenLogo =
    selectedTokens[type]?.symbol === 'SAMB'
      ? 'AMB'
      : selectedTokens[type]?.symbol;

  return (
    <>
      <TouchableOpacity onPress={toggleCurrenciesList}>
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
              {isSelectedToken ? selectedTokens[type]?.symbol : 'Select asset'}
            </Text>
          </Row>
          <Spacer horizontal value={scale(4)} />
          <ChevronDownIcon color={COLORS.neutral900} />
        </View>
      </TouchableOpacity>

      <BottomSheetCurrenciesList ref={bottomSheetRefInput} type={FIELD.INPUT} />
      <BottomSheetCurrenciesList
        ref={bottomSheetRefOutput}
        type={FIELD.OUTPUT}
      />
    </>
  );
};
