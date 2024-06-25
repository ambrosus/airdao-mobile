import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          {t('swap.button.swap')}
        </Text>
      )}
    </PrimaryButton>
  );
};
