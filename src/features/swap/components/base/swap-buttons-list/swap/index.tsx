import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { styles } from '../styles';
import { useSwapContextSelector } from '@features/swap/context';
import {
  executeSwapPath,
  isETHtoWrapped,
  isWrappedToETH
} from '@features/swap/utils';

interface SwapButtonProps {
  isProcessingSwap: boolean;
  onCompleteMultiStepSwap: () => void;
}

export const SwapButton = ({
  isProcessingSwap,
  onCompleteMultiStepSwap
}: SwapButtonProps) => {
  const { t } = useTranslation();
  const { selectedTokens, isExactInRef } = useSwapContextSelector();

  const buttonActionString = useMemo(() => {
    const { TOKEN_A, TOKEN_B } = selectedTokens;
    const isExactIn = isExactInRef.current;

    if (TOKEN_A && TOKEN_B) {
      const path = executeSwapPath(isExactIn, [
        TOKEN_A.address,
        TOKEN_B.address
      ]);

      if (isETHtoWrapped(path)) {
        return 'Wrap';
      } else if (isWrappedToETH(path)) {
        return 'Unwrap';
      }
    }

    return t('swap.button.swap');
  }, [t, isExactInRef, selectedTokens]);

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
