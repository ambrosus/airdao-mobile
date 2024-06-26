import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { styles } from '../styles';
import { useSwapContextSelector } from '@features/swap/context';
import { isETHtoWrapped, isWrappedToETH } from '@features/swap/utils';

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
        return 'Wrap';
      } else if (isWrappedToETH([TOKEN_A.address, TOKEN_B.address])) {
        return 'Unwrap';
      }
    }

    return t('swap.button.swap');
  }, [t, selectedTokens]);

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
          {buttonActionString}
        </Text>
      )}
    </PrimaryButton>
  );
};
