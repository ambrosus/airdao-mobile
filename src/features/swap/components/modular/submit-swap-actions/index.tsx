import React, { useCallback, useMemo, useState } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { styles } from './styles';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD } from '@features/swap/types';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { Spinner, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useSwapActions, useSwapSettings } from '@features/swap/lib/hooks';
import { PriceImpactExpertModeColors } from './button.colors';

export const SubmitSwapActions = () => {
  const { uiBottomSheetInformation, latestSelectedTokens, isExactInRef } =
    useSwapContextSelector();

  const { setAllowance, swapTokens } = useSwapActions();
  const { settings } = useSwapSettings();

  const [isProcessingSwap, setIsProcessingSwap] = useState(false);
  const [isIncreasingAllowance, setIsIncreassingAllowance] = useState(false);

  const multiStepButtonsDisabledStates = useMemo(() => {
    return {
      primary:
        uiBottomSheetInformation.allowance === 'increased' ||
        isIncreasingAllowance,
      secondary:
        uiBottomSheetInformation.allowance === 'increase' || isProcessingSwap
    };
  }, [
    isIncreasingAllowance,
    isProcessingSwap,
    uiBottomSheetInformation.allowance
  ]);

  const multiStepButtonActionText = useMemo(() => {
    if (uiBottomSheetInformation.allowance !== 'suitable') {
      const isExactIn = isExactInRef.current;
      const selectedTokens =
        latestSelectedTokens.current[isExactIn ? FIELD.TOKEN_A : FIELD.TOKEN_B];

      return {
        firstStep: `Approve ${selectedTokens?.symbol}`,
        secondStep: 'Swap now'
      };
    }
  }, [isExactInRef, latestSelectedTokens, uiBottomSheetInformation.allowance]);

  const firstStepTypographyStyle: StyleProp<TextStyle> = useMemo(() => {
    return {
      color: !multiStepButtonsDisabledStates.primary
        ? COLORS.neutral0
        : COLORS.alphaBlack50
    };
  }, [multiStepButtonsDisabledStates.primary]);

  const secondStepTypographyStyle: StyleProp<TextStyle> = useMemo(() => {
    return {
      color:
        uiBottomSheetInformation.allowance === 'increase'
          ? COLORS.neutral400
          : COLORS.neutral0
    };
  }, [uiBottomSheetInformation.allowance]);

  const onCompleteMultiStepSwap = useCallback(async () => {
    if (uiBottomSheetInformation.allowance === 'increase') {
      try {
        setIsIncreassingAllowance(true);
        await setAllowance();
      } finally {
        setIsIncreassingAllowance(false);
      }
    } else {
      try {
        setIsProcessingSwap(true);
        await swapTokens();
      } finally {
        setIsProcessingSwap(false);
      }
    }
  }, [setAllowance, swapTokens, uiBottomSheetInformation.allowance]);

  const multiStepSecondaryButtonStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      ...styles.multiStepButton,
      backgroundColor:
        uiBottomSheetInformation.allowance === 'increased' && !isProcessingSwap
          ? COLORS.brand500
          : COLORS.alphaBlack5
    };
  }, [isProcessingSwap, uiBottomSheetInformation.allowance]);

  // UI Button Elements
  if (
    uiBottomSheetInformation?.priceImpact &&
    uiBottomSheetInformation?.priceImpact > 15
  ) {
    return (
      <PrimaryButton
        disabled={!settings.current.extendedMode}
        onPress={onCompleteMultiStepSwap}
        colors={PriceImpactExpertModeColors(settings.current.extendedMode)}
        style={styles.button}
      >
        {isProcessingSwap ? (
          <Spinner />
        ) : (
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral0}
          >
            {!settings.current.extendedMode
              ? 'Price impact too high'
              : 'Swap anyway'}
          </Text>
        )}
      </PrimaryButton>
    );
  }

  if (uiBottomSheetInformation.allowance !== 'suitable') {
    return (
      <View style={styles.row}>
        <PrimaryButton
          style={styles.multiStepButton}
          disabled={multiStepButtonsDisabledStates.primary}
          onPress={onCompleteMultiStepSwap}
        >
          {isIncreasingAllowance ? (
            <Spinner />
          ) : (
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              style={firstStepTypographyStyle}
            >
              {multiStepButtonActionText?.firstStep}
            </Text>
          )}
        </PrimaryButton>
        <SecondaryButton
          style={multiStepSecondaryButtonStyle}
          disabled={multiStepButtonsDisabledStates.secondary}
          onPress={onCompleteMultiStepSwap}
        >
          {isProcessingSwap ? (
            <Spinner />
          ) : (
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              style={secondStepTypographyStyle}
            >
              {multiStepButtonActionText?.secondStep}
            </Text>
          )}
        </SecondaryButton>
      </View>
    );
  }

  if (uiBottomSheetInformation.allowance === 'suitable') {
    return (
      <PrimaryButton
        disabled={isProcessingSwap}
        onPress={onCompleteMultiStepSwap}
        style={styles.button}
      >
        {isProcessingSwap ? (
          <Spinner />
        ) : (
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral0}
          >
            Swap now
          </Text>
        )}
      </PrimaryButton>
    );
  }
};
