import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { SettingsInputWithLabel } from '@/features/swap/components/base';
import { PercentageBox } from '@components/composite/PercentageBox';
import { Row, Text } from '@components/base';
import { useSwapSettings } from '@features/swap/lib/hooks';
import { COLORS } from '@constants/colors';

const SLIPPAGE_TOLLERANCE_PERCENTAGES = ['0.1', '0.5', '1'];

export const SettingsSlippageTolleranceForm = () => {
  const { t } = useTranslation();
  const { _refSettingsGetter, onChangeSettings } = useSwapSettings();

  const onPercentageBoxPress = (value: number) => {
    onChangeSettings('slippageTolerance', String(value));
  };

  const onChangeSlippageToleranceHandle = useCallback(
    (value: string) => {
      onChangeSettings('slippageTolerance', value);
    },
    [onChangeSettings]
  );

  return (
    <View style={styles.container}>
      <SettingsInputWithLabel
        label={t('swap.settings.slippage')}
        value={_refSettingsGetter.slippageTolerance}
        onChangeText={onChangeSlippageToleranceHandle}
        placeholder="0.05%"
      >
        {_refSettingsGetter.slippageTolerance.length > 0 && (
          <Text
            fontSize={16}
            fontFamily="Inter_400Regular"
            color={COLORS.neutral900}
            style={styles.symbol}
          >
            %
          </Text>
        )}
      </SettingsInputWithLabel>

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
