import React, { useCallback } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Text } from '@components/base';
import { TextInput } from '@components/base/Input/Input.text';
import { COLORS } from '@constants/colors';
import { useSwapSettings } from '@features/swap/lib/hooks';
import { useSwapContextSelector } from '@features/swap/context/swap.contenxt';

interface SettingsInputWithLabelProps {
  label: string;
}

export const SettingsInputWithLabel = ({
  label
}: SettingsInputWithLabelProps) => {
  const { slippageTolerance } = useSwapContextSelector();
  const { onChangeSlippageTolerance } = useSwapSettings();

  const onChangeSlippageToleranceHandle = useCallback(
    (value: string) => {
      onChangeSlippageTolerance(value);
    },
    [onChangeSlippageTolerance]
  );

  return (
    <View style={styles.formWithLabel}>
      <Text
        fontSize={16}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral500}
      >
        {label}
      </Text>

      <TextInput
        pointerEvents="box-none"
        type="number"
        selection={{ start: 0, end: slippageTolerance.length - 1 }}
        value={slippageTolerance}
        onChangeText={onChangeSlippageToleranceHandle}
      />
    </View>
  );
};
