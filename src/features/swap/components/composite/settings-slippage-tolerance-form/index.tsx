import { useCallback } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SettingsInputWithLabel } from '@/features/swap/components/base';
import { Row, Text } from '@components/base';
import { PercentageBox } from '@components/composite/PercentageBox';
import { COLORS } from '@constants/colors';
import { useSwapSettings } from '@features/swap/lib/hooks';
import { styles } from './styles';

const SLIPPAGE_TOLERANCE_PERCENTAGES = ['0.1', '0.5', '1'];

export const SettingsSlippageToleranceForm = () => {
  const { t } = useTranslation();
  const { _refSettingsGetter, onChangeSettings } = useSwapSettings();

  const onPercentageBoxPress = (value: number) => {
    if (value.toString().includes('.')) {
      const newValue = value + '0';
      return onChangeSettings('slippageTolerance', String(newValue));
    }

    const newValue = value + '.00';
    return onChangeSettings('slippageTolerance', String(newValue));
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
        placeholder="0.50%"
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

      <Row style={styles.slippageToleranceRow} alignItems="center">
        {SLIPPAGE_TOLERANCE_PERCENTAGES.map((value) => (
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
