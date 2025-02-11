import { useMemo } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spinner, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useSwapContextSelector } from '@features/swap/context';
import { useSwapSettings } from '@features/swap/lib/hooks';
import { AllowanceStatus } from '@features/swap/types';
import { PriceImpactErrorColors } from '../utils/colors';

interface SwapErrorImpactButtonProps {
  isProcessingSwap: boolean;
  onCompleteMultiStepSwap: () => void;
  minimized?: boolean;
}

export const SwapErrorImpactButton = ({
  isProcessingSwap,
  onCompleteMultiStepSwap,
  minimized = false
}: SwapErrorImpactButtonProps) => {
  const { t } = useTranslation();
  const {
    uiBottomSheetInformation: { priceImpact, allowance }
  } = useSwapContextSelector();
  const {
    settings: {
      current: { extendedMode }
    }
  } = useSwapSettings();

  const buttonStyle = useMemo<StyleProp<ViewStyle>>(() => {
    return minimized ? { flex: 1 } : {};
  }, [minimized]);

  const disabled = useMemo(() => {
    if (priceImpact) {
      return (
        allowance === AllowanceStatus.INCREASE ||
        (priceImpact > 10 && !extendedMode)
      );
    }

    return false;
  }, [allowance, extendedMode, priceImpact]);

  const buttonActionString = useMemo(() => {
    if (minimized) {
      return t('swap.button.swap.anyway');
    }

    if (priceImpact) {
      if (priceImpact > 10 && !extendedMode) {
        return t('swap.button.impact.high');
      } else {
        return t('swap.button.swap.anyway');
      }
    }
  }, [minimized, priceImpact, t, extendedMode]);

  const buttonColors = useMemo(() => {
    if (priceImpact && priceImpact >= 5 && priceImpact < 10) {
      return PriceImpactErrorColors.expert;
    }

    return PriceImpactErrorColors[
      !extendedMode || allowance === AllowanceStatus.INCREASE
        ? 'default'
        : ('expert' as keyof typeof PriceImpactErrorColors)
    ];
  }, [allowance, extendedMode, priceImpact]);

  return (
    <PrimaryButton
      disabled={disabled}
      style={buttonStyle}
      onPress={onCompleteMultiStepSwap}
      colors={buttonColors as [string, string]}
    >
      {isProcessingSwap ? (
        <Spinner />
      ) : (
        <Text
          fontSize={16}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral0}
        >
          {buttonActionString}
        </Text>
      )}
    </PrimaryButton>
  );
};
