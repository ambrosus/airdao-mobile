import React, { useMemo } from 'react';
import { StyleProp, TextStyle, ViewStyle, View } from 'react-native';
import { styles } from '../styles';
import { Spinner, Text } from '@components/base';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { FIELD } from '@features/swap/types';
import { useSwapContextSelector } from '@features/swap/context';

interface ApprovalRequiredButtonProps {
  isIncreasingAllowance: boolean;
  isProcessingSwap: boolean;
  onCompleteMultiStepSwap: () => void;
}

export const ApprovalRequiredButton = ({
  isIncreasingAllowance,
  isProcessingSwap,
  onCompleteMultiStepSwap
}: ApprovalRequiredButtonProps) => {
  const { uiBottomSheetInformation, latestSelectedTokens, isExactInRef } =
    useSwapContextSelector();
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

  const multiStepSecondaryButtonStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      ...styles.multiStepButton,
      backgroundColor:
        uiBottomSheetInformation.allowance === 'increased' && !isProcessingSwap
          ? COLORS.brand500
          : COLORS.alphaBlack5
    };
  }, [isProcessingSwap, uiBottomSheetInformation.allowance]);

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
};
