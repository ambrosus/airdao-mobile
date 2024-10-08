import React, { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD } from '@features/swap/types';
import { SwapStringUtils } from '@features/swap/utils';
import { TokenLogo } from '@components/modular';
import { Spacer, Text } from '@components/base';
import { verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

interface BottomSheetReviewTokenItemProps {
  type: keyof typeof FIELD;
}

export const BottomSheetReviewTokenItem = ({
  type
}: BottomSheetReviewTokenItemProps) => {
  const { t } = useTranslation();
  const label = type === FIELD.TOKEN_A ? t('swap.pay') : t('swap.receive');
  const { selectedTokens, selectedTokensAmount } = useSwapContextSelector();

  const token = SwapStringUtils.extendedLogoVariants(
    selectedTokens[type]?.symbol ?? ''
  );

  const combinedTypeContainerStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      ...styles.container,
      paddingTop: type === FIELD.TOKEN_B ? verticalScale(8) : 0,
      paddingBottom: type === FIELD.TOKEN_A ? verticalScale(8) : 0
    };
  }, [type]);

  return (
    <View style={combinedTypeContainerStyle}>
      <Text
        fontSize={14}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral400}
      >
        {label}
      </Text>
      <View style={styles.inner}>
        <TokenLogo token={token} scale={0.65} />
        <Spacer horizontal value={4} />
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
        >
          {SwapStringUtils.transformAmountValue(selectedTokensAmount[type])}{' '}
          {selectedTokens[type]?.symbol}
        </Text>
      </View>
    </View>
  );
};
