import React, { useCallback, useMemo } from 'react';
import Animated, { AnimatedStyleProp } from 'react-native-reanimated';
import { styles } from './styles';
import { Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { COLORS } from '@constants/colors';
import { MarketType } from '@features/kosmos/types';
import { useTransactionErrorHandler } from '@features/kosmos/lib/hooks';

type AnimatedStyleType = AnimatedStyleProp<{ marginTop: number }>;

interface ReviewBondPurchaseButtonProps {
  animatedStyle: AnimatedStyleType;
  market: MarketType;
  onPreviewPurchase: () => void;
}

export const ReviewBondPurchaseButton = ({
  animatedStyle,
  market,
  onPreviewPurchase
}: ReviewBondPurchaseButtonProps) => {
  const { error } = useTransactionErrorHandler(market);
  const { amountToBuy } = useKosmosMarketsContextSelector();

  const onPreviewPurchasePress = useCallback(
    async () => onPreviewPurchase(),
    [onPreviewPurchase]
  );

  const disabled = useMemo(
    () => !parseFloat(amountToBuy) || error !== '',
    [amountToBuy, error]
  );

  const label = useMemo(
    () => (disabled ? 'Enter amount to buy' : 'Preview'),
    [disabled]
  );

  const textColor = useMemo(() => {
    return disabled ? COLORS.alphaBlack30 : COLORS.neutral0;
  }, [disabled]);

  return (
    <Animated.View style={[styles.footer, animatedStyle]}>
      <PrimaryButton
        disabled={disabled}
        style={styles.button}
        onPress={onPreviewPurchasePress}
      >
        <Text fontSize={16} fontFamily="Inter_500Medium" color={textColor}>
          {label}
        </Text>
      </PrimaryButton>
    </Animated.View>
  );
};
