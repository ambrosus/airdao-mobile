import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { SettingsInputWithLabel } from '@/features/swap/components/base';
import { PercentageBox } from '@components/composite/PercentageBox';
import { Row } from '@components/base';
import { useSwapSettings } from '@features/swap/lib/hooks';

const SLIPPAGE_TOLLERANCE_PERCENTAGES = ['0.1', '0.5', '1'];

export const SettingsSlippageTolleranceForm = () => {
  const { onChangeSlippageTolerance } = useSwapSettings();

  const onPercentageBoxPress = (value: number) => {
    onChangeSlippageTolerance(String(value));
  };

  return (
    <View style={styles.container}>
      <SettingsInputWithLabel label=" Slippage tolerance" />

      <Row style={styles.slippageTolleranceRow} alignItems="center">
        {SLIPPAGE_TOLLERANCE_PERCENTAGES.map((value) => (
          <PercentageBox
            key={value}
            percentage={+value}
            onPress={onPercentageBoxPress}
          />
        ))}
      </Row>
    </View>
  );
};
