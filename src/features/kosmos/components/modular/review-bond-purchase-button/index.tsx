import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { COLORS } from '@constants/colors';
import { MarketType } from '@features/kosmos/types';
import { useTransactionErrorHandler } from '@features/kosmos/lib/hooks';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle
} from 'react-native-reanimated';
import { buttonWithShadowStyle } from '@constants/shadow';

interface ReviewBondPurchaseButtonProps {
  market: MarketType | undefined;
  onPreviewPurchase: () => void;
}

export const ReviewBondPurchaseButton = ({
  market,
  onPreviewPurchase
}: ReviewBondPurchaseButtonProps) => {
  const { t } = useTranslation();
  const { error } = useTransactionErrorHandler(market);
  const { amountToBuy } = useKosmosMarketsContextSelector();
  const { height } = useAnimatedKeyboard();

  const onPreviewPurchasePress = useCallback(
    async () => onPreviewPurchase(),
    [onPreviewPurchase]
  );

  const disabled = useMemo(
    () => !parseFloat(amountToBuy) || error !== '' || !market?.isLive,
    [amountToBuy, error, market?.isLive]
  );

  const label = useMemo(
    () =>
      !market?.isLive
        ? t('kosmos.button.market.closed')
        : disabled
        ? t('button.enter.amount')
        : t('common.review'),
    [disabled, market?.isLive, t]
  );

  const textColor = useMemo(() => {
    return disabled ? COLORS.brand75 : COLORS.neutral0;
  }, [disabled]);

  const animatedDividerStyle = useAnimatedStyle(() => {
    const { value } = height;
    return {
      borderTopWidth: value > 24 ? 0 : 1
    };
  });

  return (
    <Animated.View style={[styles.footer, animatedDividerStyle]}>
      <PrimaryButton
        disabled={disabled}
        style={buttonWithShadowStyle(disabled, styles.button)}
        onPress={onPreviewPurchasePress}
      >
        <Text fontSize={16} fontFamily="Inter_500Medium" color={textColor}>
          {label}
        </Text>
      </PrimaryButton>
    </Animated.View>
  );
};
