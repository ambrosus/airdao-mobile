import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useSwapSettings } from '@features/swap/lib/hooks';
import { Spinner, Text } from '@components/base';
import { PriceImpactErrorColors } from '../utils/colors';
import { useSwapContextSelector } from '@features/swap/context/swap.contenxt';

interface SwapErrorImpactButtonProps {
  isProcessingSwap: boolean;
  onCompleteMultiStepSwap: () => void;
}

export const SwapErrorImpactButton = ({
  isProcessingSwap,
  onCompleteMultiStepSwap
}: SwapErrorImpactButtonProps) => {
  const { t } = useTranslation();
  const { uiBottomSheetInformation } = useSwapContextSelector();
  const { settings } = useSwapSettings();

  const disabled = useMemo(() => {
    if (uiBottomSheetInformation.priceImpact) {
      return (
        uiBottomSheetInformation.priceImpact > 10 &&
        !settings.current.extendedMode
      );
    }

    return false;
  }, [settings, uiBottomSheetInformation.priceImpact]);

  const buttonActionString = useMemo(() => {
    const { priceImpact } = uiBottomSheetInformation;
    const expertMode = settings.current.extendedMode;

    if (priceImpact) {
      if (priceImpact > 10 && !expertMode) {
        return t('swap.button.impact.high');
      } else {
        return t('swap.button.swap.anyway');
      }
    }
  }, [settings, uiBottomSheetInformation, t]);

  const buttonColors = useMemo(() => {
    const { priceImpact } = uiBottomSheetInformation;
    const expertMode = settings.current.extendedMode;

    if (priceImpact && priceImpact >= 5 && priceImpact < 10) {
      return PriceImpactErrorColors.expert;
    }

    return PriceImpactErrorColors[
      !expertMode
        ? 'default'
        : ('expert' as keyof typeof PriceImpactErrorColors)
    ];
  }, [uiBottomSheetInformation, settings]);

  return (
    <PrimaryButton
      disabled={disabled}
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
