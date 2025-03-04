import { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spinner, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useSwapContextSelector } from '@features/swap/context';
import { isETHtoWrapped, isWrappedToETH } from '@features/swap/utils';
import { cssShadowToNative } from '@utils';
import { styles } from '../styles';

interface SwapButtonProps {
  isProcessingSwap: boolean;
  onCompleteMultiStepSwap: () => void;
}

export const SwapButton = ({
  isProcessingSwap,
  onCompleteMultiStepSwap
}: SwapButtonProps) => {
  const { t } = useTranslation();
  const { selectedTokens, isInsufficientBalance } = useSwapContextSelector();

  const disabled = useMemo(
    () => isProcessingSwap || isInsufficientBalance,
    [isInsufficientBalance, isProcessingSwap]
  );

  const buttonActionString = useMemo(() => {
    const { TOKEN_A, TOKEN_B } = selectedTokens;

    if (TOKEN_A && TOKEN_B) {
      if (isETHtoWrapped([TOKEN_A.address, TOKEN_B.address])) {
        return t('swap.button.wrap');
      } else if (isWrappedToETH([TOKEN_A.address, TOKEN_B.address])) {
        return t('swap.button.unwrap');
      }
    }

    if (isInsufficientBalance) {
      return t('bridge.insufficient.funds');
    }

    return t('button.confirm');
  }, [isInsufficientBalance, selectedTokens, t]);

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
      disabled={disabled}
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
            {t('button.swapping')}
          </Text>
        </Row>
      ) : (
        <Text
          fontSize={16}
          fontFamily="Inter_600SemiBold"
          color={disabled ? COLORS.brand75 : COLORS.neutral0}
        >
          {buttonActionString}
        </Text>
      )}
    </PrimaryButton>
  );
};
