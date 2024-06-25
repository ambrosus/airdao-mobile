import React from 'react';
import { Spinner, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { styles } from '../styles';

interface SwapButtonProps {
  isProcessingSwap: boolean;
  onCompleteMultiStepSwap: () => void;
}

export const SwapButton = ({
  isProcessingSwap,
  onCompleteMultiStepSwap
}: SwapButtonProps) => {
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
};
