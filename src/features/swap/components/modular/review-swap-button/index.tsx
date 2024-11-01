import React, { useCallback, useMemo, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '@components/modular';
import { Spinner, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useSwapContextSelector } from '@features/swap/context';
import {
  useSwapInterface,
  useSwapMultiplyBalance
} from '@features/swap/lib/hooks';
import { buttonActionString } from '@features/swap/utils/button-action.string';
import { cssShadowToNative } from '@utils/css-shadow-to-native';

export const ReviewSwapButton = () => {
  const { t } = useTranslation();
  const { bnBalances } = useSwapMultiplyBalance();
  const { resolveBottomSheetData } = useSwapInterface();
  const {
    selectedTokens,
    selectedTokensAmount,
    isWarningToEnableMultihopActive
  } = useSwapContextSelector();

  const [isProcessingBottomSheet, setIsProcessingBottomSheet] = useState(false);

  const swapButtonString = useMemo(() => {
    if (isWarningToEnableMultihopActive) {
      return 'Enable multihops trade';
    }

    return buttonActionString(
      selectedTokens,
      selectedTokensAmount,
      bnBalances,
      t
    );
  }, [
    isWarningToEnableMultihopActive,
    selectedTokens,
    selectedTokensAmount,
    bnBalances,
    t
  ]);

  const onResolveBottomSheetDataPress = useCallback(async () => {
    try {
      setIsProcessingBottomSheet(true);
      await resolveBottomSheetData();
    } catch (error) {
      throw error;
    } finally {
      setIsProcessingBottomSheet(false);
    }
  }, [resolveBottomSheetData]);

  const disabled = useMemo(() => {
    return (
      swapButtonString !== t('swap.button.review') || isProcessingBottomSheet
    );
  }, [t, swapButtonString, isProcessingBottomSheet]);

  const buttonColors = useMemo(() => {
    return disabled
      ? [COLORS.primary50, COLORS.primary50]
      : [COLORS.brand600, COLORS.brand600];
  }, [disabled]);

  const buttonShadow: StyleProp<ViewStyle> = useMemo(() => {
    if (disabled) return { shadowOpacity: 0 };

    return cssShadowToNative('0px 0px 12px 0px rgba(53, 104, 221, 0.50)');
  }, [disabled]);

  return (
    <PrimaryButton
      colors={buttonColors}
      disabled={disabled}
      style={buttonShadow}
      onPress={onResolveBottomSheetDataPress}
    >
      {isProcessingBottomSheet ? (
        <Spinner />
      ) : (
        <Text
          fontSize={17}
          fontFamily="Inter_600SemiBold"
          color={disabled ? COLORS.brand75 : COLORS.neutral0}
        >
          {swapButtonString}
        </Text>
      )}
    </PrimaryButton>
  );
};
