import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';
import { Row, Spinner, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { styles } from '../styles';
import { useSwapContextSelector } from '@features/swap/context';
import { isETHtoWrapped, isWrappedToETH } from '@features/swap/utils';
import { cssShadowToNative } from '@utils/css-shadow-to-native';

interface SwapButtonProps {
  isProcessingSwap: boolean;
  onCompleteMultiStepSwap: () => void;
}

export const SwapButton = ({
  isProcessingSwap,
  onCompleteMultiStepSwap
}: SwapButtonProps) => {
  const { t } = useTranslation();
  const { selectedTokens } = useSwapContextSelector();

  const buttonActionString = useMemo(() => {
    const { TOKEN_A, TOKEN_B } = selectedTokens;

    if (TOKEN_A && TOKEN_B) {
      if (isETHtoWrapped([TOKEN_A.address, TOKEN_B.address])) {
        return t('swap.button.wrap');
      } else if (isWrappedToETH([TOKEN_A.address, TOKEN_B.address])) {
        return t('swap.button.unwrap');
      }
    }

    // return t('swap.button.swap');
    return 'Confirm';
  }, [selectedTokens, t]);

  const buttonColors = useMemo(() => {
    return isProcessingSwap
      ? [COLORS.primary50, COLORS.primary50]
      : [COLORS.brand600, COLORS.brand600];
  }, [isProcessingSwap]);

  const buttonShadow: StyleProp<ViewStyle> = useMemo(() => {
    if (isProcessingSwap) return { shadowOpacity: 0 };

    return cssShadowToNative('0px 0px 12px 0px rgba(53, 104, 221, 0.50)');
  }, [isProcessingSwap]);

  return (
    <PrimaryButton
      disabled={isProcessingSwap}
      colors={buttonColors}
      onPress={onCompleteMultiStepSwap}
      style={{ ...styles.button, ...buttonShadow }}
    >
      {isProcessingSwap ? (
        <Row style={styles.pendingLayout} alignItems="center">
          <Spinner size="xs" />
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={COLORS.brand600}
          >
            Swapping
          </Text>
        </Row>
      ) : (
        <Text
          fontSize={16}
          fontFamily="Inter_600SemiBold"
          color={isProcessingSwap ? COLORS.brand75 : COLORS.neutral0}
        >
          {buttonActionString}
        </Text>
      )}
    </PrimaryButton>
  );
};
