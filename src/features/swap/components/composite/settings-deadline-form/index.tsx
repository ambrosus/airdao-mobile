import { useCallback } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Text } from '@components/base';
import { TextInput } from '@components/base/Input/Input.text';
import { COLORS } from '@constants/colors';
import { useSwapSettings } from '@features/swap/lib/hooks';
import { styles } from './styles';

export const SettingsDeadlineForm = () => {
  const { t } = useTranslation();
  const { _refSettingsGetter, onChangeSettings } = useSwapSettings();

  const onChangeDeadline = useCallback(
    (value: string) => {
      onChangeSettings('deadline', value);
    },
    [onChangeSettings]
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputWithLabel}>
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
        >
          {t('swap.settings.deadline')}
        </Text>

        <Row alignItems="center" justifyContent="space-between">
          <TextInput
            type="number"
            keyboardType="numeric"
            style={styles.input}
            placeholder="20"
            value={_refSettingsGetter.deadline}
            onChangeText={onChangeDeadline}
          />
          <Text
            fontSize={16}
            fontFamily="Inter_400Regular"
            color={COLORS.neutral800}
          >
            {t('swap.settings.label.minutes')}
          </Text>
        </Row>
      </View>
    </View>
  );
};
