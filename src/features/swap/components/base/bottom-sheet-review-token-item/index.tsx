import { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spacer, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD } from '@features/swap/types';
import { SwapStringUtils } from '@features/swap/utils';
import { getTokenNameFromDatabase, verticalScale } from '@utils';
import { styles } from './styles';

interface BottomSheetReviewTokenItemProps {
  type: keyof typeof FIELD;
}

export const BottomSheetReviewTokenItem = ({
  type
}: BottomSheetReviewTokenItemProps) => {
  const { t } = useTranslation();
  const label = type === FIELD.TOKEN_A ? t('swap.pay') : t('swap.receive');
  const { selectedTokens, selectedTokensAmount } = useSwapContextSelector();

  const tokenLogoHref = useMemo(() => {
    const token = selectedTokens[type];
    return getTokenNameFromDatabase(token.address) !== 'unknown'
      ? token.symbol
      : token.address;
  }, [selectedTokens, type]);

  const token = SwapStringUtils.extendedLogoVariants(tokenLogoHref);

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
        fontSize={13}
        fontFamily="Inter_600SemiBold"
        color={COLORS.neutral500}
      >
        {label}
      </Text>
      <View style={styles.inner}>
        <TokenLogo token={token} scale={0.65} />
        <Spacer horizontal value={4} />
        <Text
          fontSize={17}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral800}
        >
          {SwapStringUtils.transformAmountValue(selectedTokensAmount[type])}{' '}
          {selectedTokens[type]?.symbol}
        </Text>
      </View>
    </View>
  );
};
