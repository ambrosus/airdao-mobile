import React, { useMemo } from 'react';
import { StyleProp, TextStyle, ViewStyle, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spinner, Text } from '@components/base';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useSwapContextSelector } from '@features/swap/context';
import { AllowanceStatus } from '@features/swap/types';
import { styles } from '../styles';

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
  const { t } = useTranslation();
  const { uiBottomSheetInformation, latestSelectedTokens } =
    useSwapContextSelector();

  const multiStepButtonsDisabledStates = useMemo(() => {
    return {
      primary:
        uiBottomSheetInformation.allowance === AllowanceStatus.INCREASED ||
        isIncreasingAllowance,
      secondary:
        uiBottomSheetInformation.allowance === AllowanceStatus.INCREASE ||
        isProcessingSwap
    };
  }, [
    isIncreasingAllowance,
    isProcessingSwap,
    uiBottomSheetInformation.allowance
  ]);

  const multiStepButtonActionText = useMemo(() => {
    if (uiBottomSheetInformation.allowance !== AllowanceStatus.SUITABLE) {
      const selectedTokens = latestSelectedTokens.current.TOKEN_A;

      return {
        firstStep: t('swap.button.approve', {
          symbol: selectedTokens?.symbol
        }),
        secondStep: t('swap.button.swap')
      };
    }
  }, [t, latestSelectedTokens, uiBottomSheetInformation.allowance]);

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
        uiBottomSheetInformation.allowance === AllowanceStatus.INCREASE
          ? COLORS.neutral400
          : COLORS.neutral0
    };
  }, [uiBottomSheetInformation.allowance]);

  const multiStepSecondaryButtonStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      ...styles.multiStepButton,
      backgroundColor:
        uiBottomSheetInformation.allowance === AllowanceStatus.INCREASED &&
        !isProcessingSwap
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
