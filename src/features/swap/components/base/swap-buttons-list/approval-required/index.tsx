import { useMemo } from 'react';
import { StyleProp, TextStyle, ViewStyle, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spinner, Text } from '@components/base';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useSwapContextSelector } from '@features/swap/context';
import { AllowanceStatus } from '@features/swap/types';
import { SwapErrorImpactButton } from '../error-impact';
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
  const {
    uiBottomSheetInformation: { allowance, priceImpact },
    latestSelectedTokens
  } = useSwapContextSelector();

  const isPriceImpactHighlighted = useMemo(() => {
    return priceImpact && priceImpact >= 5;
  }, [priceImpact]);

  const multiStepButtonsDisabledStates = useMemo(() => {
    return {
      primary: allowance === AllowanceStatus.INCREASED || isIncreasingAllowance,
      secondary: allowance === AllowanceStatus.INCREASE || isProcessingSwap
    };
  }, [isIncreasingAllowance, isProcessingSwap, allowance]);

  const multiStepButtonActionText = useMemo(() => {
    if (allowance !== AllowanceStatus.SUITABLE) {
      const selectedTokens = latestSelectedTokens.current.TOKEN_A;

      return {
        firstStep: t('swap.button.approve', {
          symbol: selectedTokens?.symbol
        }),
        secondStep: t('swap.button.swap')
      };
    }
  }, [t, latestSelectedTokens, allowance]);

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
        allowance === AllowanceStatus.INCREASE
          ? COLORS.neutral400
          : COLORS.neutral0
    };
  }, [allowance]);

  const multiStepSecondaryButtonStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      ...styles.multiStepButton,
      backgroundColor:
        allowance === AllowanceStatus.INCREASED && !isProcessingSwap
          ? COLORS.brand500
          : COLORS.alphaBlack5
    };
  }, [isProcessingSwap, allowance]);

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
      {isPriceImpactHighlighted ? (
        <SwapErrorImpactButton
          isProcessingSwap={isProcessingSwap}
          onCompleteMultiStepSwap={onCompleteMultiStepSwap}
          minimized
        />
      ) : (
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
      )}
    </View>
  );
};
